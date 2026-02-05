import Apple from './Apple'
import './index.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 2, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 1, 0.05)
  })
  return null
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function App({ count=50, depth=80 }) {
  const audioRef = useRef()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const a = audioRef.current
    const onTime = () => {
      setCurrentTime(a.currentTime)
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
    }
    const onMeta = () => setDuration(a.duration)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)

    // Autoplay on first user interaction (browsers block unmuted autoplay)
    const tryPlay = () => {
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
    tryPlay()
    const startOnInteract = () => {
      tryPlay()
      window.removeEventListener('click', startOnInteract)
      window.removeEventListener('keydown', startOnInteract)
      window.removeEventListener('touchstart', startOnInteract)
    }
    window.addEventListener('click', startOnInteract)
    window.addEventListener('keydown', startOnInteract)
    window.addEventListener('touchstart', startOnInteract)

    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      window.removeEventListener('click', startOnInteract)
      window.removeEventListener('keydown', startOnInteract)
      window.removeEventListener('touchstart', startOnInteract)
    }
  }, [])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (a.paused) {
      a.play()
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }, [])

  const seek = useCallback((e) => {
    const a = audioRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    a.currentTime = ratio * a.duration
  }, [])

  return (
    <>
    <audio ref={audioRef} src="/ppap.mp3" loop />
    <div className="music-controls">
      <button className="music-btn" onClick={toggle}>
        {playing ? '⏸' : '▶'}
      </button>
      <span className="music-time">{formatTime(currentTime)}</span>
      <div className="music-progress-bar" onClick={seek}>
        <div className="music-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="music-time">{formatTime(duration)}</span>
    </div>
    <Canvas gl={{alpha: false}} camera={{ near: 0.01, far: 120, fov: 50}}>
      <color attach="background" args={["#ffbf40"]} />
      <ambientLight intensity={0.05} />
      <Suspense fallback={null}>
        {Array.from({ length: count}, (_, i) => (
          <Apple key={i} z={-(i / count) * depth - 20}/>))}
        <Environment preset='sunset' />
      </Suspense>
      <Rig />
      <EffectComposer>
          <DepthOfField target={[0,0,depth/2]} focalLength={1} bokehScale={10} height={700}/>
      </EffectComposer>
      <Text
      color="#000000"
      maxWidth={ 0.25 }
      lineHeight={ 0.75 }
      textAlign="right"
      anchorX="center"
      anchorY="middle"
    >
      APPLES
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </Canvas>
    </>
  )
}

