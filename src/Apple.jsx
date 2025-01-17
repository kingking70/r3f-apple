import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from 'three'

export default function Apple({ z }) {

    const fruitRef = useRef()
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])
    const { nodes, materials } = useGLTF('/apple-v1-transformed.glb')


    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(height),
        rX: Math.random() * Math.PI,
        rY: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI
    })

    useFrame((state, delta) => {
        fruitRef.current.rotation.set((data.rX += 0.001), (data.rY += 0.005), (data.rZ += 0.005))
        fruitRef.current.position.set(data.x * width, (data.y -= 0.02), z)
        if (data.y > height) {
            data.y = - height
        }
    })

    return (
        <>
            <mesh scale={0.04} ref={fruitRef} geometry={nodes['apple_low_obj_Material_#35_0'].geometry} material={materials.Material_35} position={[-13.564, 3.711, -4.175]} />
        </>
    )
}