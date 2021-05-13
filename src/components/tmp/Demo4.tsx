import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import colors from 'nice-color-palettes';
import THREE from 'three';

function getRandomColor(): string {
  const paletteIndex = Math.floor(Math.random() * colors.length);
  const colorIndex = Math.floor(Math.random() * colors[0].length);
  return colors[paletteIndex][colorIndex];
}

function Plane(props: any) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={colors[0][3]} />
    </mesh>
  )
}

function Ball(props: any) {
  const [ref] = useSphere(() => ({
    mass: 1,
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.7, 30, 30]} />
      <meshStandardMaterial color={colors[1][1]} />
    </mesh>
  )
}

function Box(props: any) {
  const [ref] = useBox(() => ({
    mass: 1,
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow >
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={colors[0][2]} />
    </mesh>
  )
}

function Ground(props: any) {
  const [ref] = useBox(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[50, 50, 1]} />
      <meshStandardMaterial color={colors[0][3]} />
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ height: `400px` }}>
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [5, 5, 5] }}
        shadows
      >
        <ambientLight intensity={0.1} />
        {/*<pointLight position={[10, 10, 10]} />*/}
        <directionalLight position={[10, 10, 10]} />
        <Physics gravity={[0, -10, 0]}>
          <Box position={[-2, 5, 0]} />
          <Box position={[2, 5, 0]} />
          <Ball position={[2, 7, 2]} />
          {/*<Ground position={[0, 0, 0]} />*/}
          <Plane />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Demo;
