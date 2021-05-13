import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useSphere, useBox, usePlane, BoxProps, SphereProps } from '@react-three/cannon';

function Ball(props: any) {
  const { args = [1, 1, 1], color, ...rest } = props;
  const [ref] = useSphere((): SphereProps => ({ args, mass: 1, ...rest }))
  return (
    <mesh ref={ref}>
      <sphereGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Ground(props: any) {
  const { args = [10, 1, 10], color = 'green' } = props;
  const [ref, api] = useBox((): BoxProps => ({
    args,
  }));
  useFrame(() => {
    api.position.set(0, 0, 0);
    api.rotation.set(0, 0, 0);
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Plane(props: any) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    mass: 0,
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry />
      <meshStandardMaterial color="#171717" />
    </mesh>
  )
}

function Cube(props: any) {
  const [ref] = useBox(() => ({
    mass: 1,
    args: [1, 1, 1],
    position: [0, 5, 0],
    ...props,
  }))
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry />
      <meshStandardMaterial color="#FF0000"/>
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ width: '500px', height: '400px' }}>
      <Canvas
        camera={{ position: [-1, 1, 2.5], fov: 50 }}
      >
        {/*<color attach="background" args={['black']} />*/}
        {/*<ambientLight intensity={3.5} />*/}
        {/*<pointLight position={[150, 150, 150]} intensity={0.55} />*/}
        {/*<hemisphereLight intensity={3.35} />*/}
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Physics
          gravity={[0, -10, 0]}
          defaultContactMaterial={{ restitution: 0.6 }}
        >
          <Cube />
          <Plane />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Demo;
