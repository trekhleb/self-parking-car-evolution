import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated, config } from 'react-spring/three';

function Box(props: JSX.IntrinsicElements['mesh']) {
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
    config: config.wobbly,
  });
  useFrame((state, delta) => {
    if (!mesh.current) {
      return;
    }
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  })
  return (
    <animated.mesh
      {...props}
      ref={mesh}
      scale={scale}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </animated.mesh>
  )
}

function ThreeJSFiber() {
  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default ThreeJSFiber;
