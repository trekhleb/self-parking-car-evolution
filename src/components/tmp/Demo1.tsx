import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';

// type BoxProps = JSX.IntrinsicElements['mesh'];
type BoxProps = any;

function Box(props: BoxProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState<boolean>(false);

  let direction = 0.01
  useFrame(() => {
    if (!mesh.current) {
      return;
    }
    if (mesh.current.position.x > 1) {
      direction = -0.01
    } else if (mesh.current.position.x < -1) {
      direction = 0.01
    }
    if (props.move) {
      mesh.current.rotation.y = mesh.current.rotation.y += 0.01
      mesh.current.position.x = mesh.current.position.x + direction
    }
  })
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={props.scale || [2, 0.5, 2]}
      onClick={(e) => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} metalness={0.2} />
    </mesh>
  )
}

function Demo1() {
  const colors = ['#173f5f', '#20639b', '#3caea3', '#f6d55c', '#ed553b'];

  const [boxes, setBoxes] = useState<BoxProps[]>([]);

  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max))
  }

  function generateNewBlock() {
    const total = boxes.length;
    const color = colors[getRandomInt(6)];
    let newBoxes = boxes.map((props: BoxProps) => ({ ...props, move: false }))
    newBoxes.push({
      position: [getRandomInt(3), total * 0.5 - 3, 0],
      move: true,
      color,
    })
    setBoxes([...newBoxes])
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
          {boxes.map((props) => (
            <Box {...props} />
          ))}
          <Box position={[0, -3.5, 0]} scale={[3, 0.5, 3]} color="hotpink" />
          <Html>
            <div>{`Score: ${boxes.length}`}</div>
          </Html>
          <OrbitControls />
        </Canvas>
        <button onClick={() => generateNewBlock()}>Do</button>
      </div>
    </>
  );
}

export default Demo1;
