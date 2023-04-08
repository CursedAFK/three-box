import { useSpring, animated } from '@react-spring/three'
import {
  MeshWobbleMaterial,
  OrbitControls,
  SoftShadows
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { MathUtils } from 'three'

function SpinningMesh({ position, args, color, speed }) {
  const [expand, setExpand] = useState(false)

  const meshRef = useRef(null)

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1]
  })

  useFrame(() => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      castShadow
      scale={props.scale}
      onClick={() => setExpand(prev => !prev)}
    >
      <boxBufferGeometry attach='geometry' args={args} />
      <MeshWobbleMaterial
        speed={speed}
        factor={0.6}
        attach='material'
        color={color}
      />
    </animated.mesh>
  )
}

export default function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [-5, 2, 10],
          fov: 60
        }}
        shadows
      >
        <SoftShadows />
        <OrbitControls />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          castShadow
        />

        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <group>
          <SpinningMesh
            position={[0, 1, 0]}
            args={[3, 2, 1]}
            color='lightblue'
            speed={2}
          />
          <SpinningMesh position={[-2, 1, -5]} color='pink' speed={6} />
          <SpinningMesh position={[5, 1, -2]} color='pink' speed={6} />

          <mesh
            rotation={[-MathUtils.degToRad(90), 0, 0]}
            position={[0, -3, 0]}
            receiveShadow
          >
            <planeBufferGeometry attach='geometry' args={[100, 100]} />
            <shadowMaterial attach='material' opacity={0.3} />
          </mesh>
        </group>
      </Canvas>
    </>
  )
}
