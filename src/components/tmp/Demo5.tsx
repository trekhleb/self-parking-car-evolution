import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useBox, useCylinder, usePlane, useSphere } from '@react-three/cannon';
import colors from 'nice-color-palettes';

function Plane(props: any) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow >
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshPhysicalMaterial attach="material" color={colors[6][3]} />
    </mesh>
  )
}

function Ball(props: any) {
  const [ref] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.7, 30, 30]} />
      <meshPhysicalMaterial attach="material" color={colors[1][1]} />
    </mesh>
  )
}

function Box(props: any) {
  const [ref] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow >
      <boxGeometry args={[1, 2, 1]} />
      <meshPhysicalMaterial attach="material" color={colors[0][2]} />
    </mesh>
  )
}

function Cylinder(props: any) {
  const [ref] = useCylinder(() => ({
    mass: 1,
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow >
      <cylinderGeometry args={[1, 1, 2, 20]} />
      <meshPhysicalMaterial attach="material" color={colors[18][2]} />
    </mesh>
  )
}

function Ground(props: any) {
  const [ref] = useBox(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    type: 'Static',
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[10, 10, 0.3]} />
      <meshPhysicalMaterial attach="material" color={colors[0][3]} />
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ height: `550px` }}>
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [10, -3, 10] }}
        shadows
      >
        <ambientLight intensity={0.1} />
        <pointLight castShadow position={[10, 10, 10]} />
        <directionalLight castShadow position={[10, 10, 10]} />
        <Physics gravity={[0, -20, 0]}>
          <Box position={[-2, 5, 0]} />
          <Box position={[2, 5, 0]} />
          <Box position={[2.5, 10, 0.5]} />
          <Cylinder position={[-5, 10, 0.5]} />
          <Ball position={[2, 7, 2]} />
          <Ground position={[5, -2, 0]} />
          <Plane position={[0, -5, 0]}  />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Demo;
