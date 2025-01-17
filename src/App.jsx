import Apple from './Apple'
import './index.css'
import { Canvas } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import { Suspense } from 'react'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

export default function App({ count=50, depth=80 }) {

  return (
    <Canvas gl={{alpha: false}} camera={{ near: 0.01, far: 120, fov: 50}}>
      <color attach="background" args={["#ffbf40"]} />
      <ambientLight intensity={0.05} />
      <Suspense fallback={null}>
        {Array.from({ length: count}, (_, i) => (
          <Apple key={i} z={-(i / count) * depth - 20}/>))}
        <Environment preset='sunset' />
      </Suspense>
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
  )
}

