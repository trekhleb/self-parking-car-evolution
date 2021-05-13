import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useBox, useCylinder, usePlane, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

function Plane(props: any) {
  const args: [number, number] = [10, 10];
  const [ref] = usePlane(() => ({
    args,
    mass: 0,
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={args} />
      <shadowMaterial attach="material" color="#171717" opacity={0.5} />
    </mesh>
  )
}

function Box(props: any) {
  const args: [number, number, number] = [0.1, 0.2, 0.1];
  const [ref] = useBox(() => ({
    mass: 1,
    args,
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    // sleepSpeedLimit: 10.0,
    ...props,
  }))
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    // ref.current.rotation.x = clock.getElapsedTime();
  })
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshLambertMaterial attach="material" color={0xff0000} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Cylinder(props: any) {
  const args: [number, number, number, number] = [0.1, 0.1, 0.5, 20];
  const [ref] = useCylinder(() => ({
    mass: 1,
    args,
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <cylinderBufferGeometry attach="geometry" args={args} />
      <meshLambertMaterial attach="material" color={0x00ff00} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Sphere(props: any) {
  const args: [number, number, number] = [0.1, 20, 20];
  const [ref] = useSphere(() => ({
    mass: 1,
    args,
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <sphereBufferGeometry attach="geometry" args={args} />
      <meshLambertMaterial attach="material" color={0x00ff00} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ height: `550px` }}>
      <Canvas
        camera={{ fov: 50, position: [-1, 1, 2.5] }}
        shadows
      >
        {/*<ambientLight intensity={0.3}/>*/}
        {/*<pointLight position={[-5, 10, 10]} intensity={0.5} castShadow />*/}
        {/*<directionalLight position={[10, 10, 10]} intensity={0.3} castShadow />*/}
        <color attach="background" args={['lightblue']} />
        <hemisphereLight intensity={0.35} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          castShadow
        />
        <Physics
          gravity={[0, -10, 0]}
          defaultContactMaterial={{
            friction: 0.01,
            restitution: 0.3,
          }}
        >
          <Plane />
          <Box />
          <Box />
          <Box />
          <Cylinder />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Demo;
