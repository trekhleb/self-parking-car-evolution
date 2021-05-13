import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useSphere, useBox } from '@react-three/cannon';

type BallProps = any;

function Ball(props: BallProps) {
  const { args = [0.2, 32, 32], color } = props
  const [ref] = useSphere(() => ({ args: 0.2, mass: 1 }))
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

type GroundProps = any;

function Ground(props: GroundProps) {
  const { args = [10, 0.8, 1] } = props
  const [ref, api] = useBox(() => ({ args }))

  useFrame(() => {
    api.position.set(0, -3.5, 0)
    api.rotation.set(0, 0, -0.08)
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <meshStandardMaterial color={'green'} />
    </mesh>
  )
}

function Demo2() {
  const colors = ['#173f5f', '#20639b', '#3caea3', '#f6d55c', '#ed553b'];

  const [balls, setBalls] = useState<BallProps[]>([]);

  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max))
  }

  function generateNewBlock() {
    const total = balls.length;
    const color = colors[getRandomInt(6)];
    let newBalls = balls.map((props: BallProps) => ({ ...props, move: false }))
    newBalls.push({
      position: [getRandomInt(3), total * 0.5 - 3, 0],
      move: true,
      color,
    })
    setBalls([...newBalls])
  }

  return (
    <>
      <div style={{ width: '500px', height: '300px', background: '#eee' }}>
        <Canvas
          camera={{ position: [0, 7, 7], near: 1, far: 20 }}
          onCreated={({ gl }) => gl.setClearColor('lightpink')}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[150, 150, 150]} intensity={0.55} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Physics
            gravity={[0, -26, 0]}
            defaultContactMaterial={{ restitution: 0.6 }}
          >
            {balls.map((props: any) => (
              <Ball {...props} />
            ))}
            <Ground />
          </Physics>
          <OrbitControls />
        </Canvas>
        <button onClick={() => generateNewBlock()}>Do</button>
      </div>
    </>
  );
}

export default Demo2;
