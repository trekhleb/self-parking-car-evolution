import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';

import Ground from './Ground';
import Car from './Car/Car';
import Pillar from './Pillar';
import { NumVec3 } from '../types/vectors';

function ParkingLot() {

  const activeCar = (
    <Car
      position={[0, 5, 0]}
      angularVelocity={[-0.2, 0, 0.2]}
      wireframe={false}
      controllable
      styled
    />
  );

  const rows = 2;
  const cols = 5
  const carLength = 4;
  const carWidth = 1.7;
  const staticCarPositions: NumVec3[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row === 0 && col === 2) {
        continue;
      }
      const marginedLength = 1.4 * carLength;
      const marginedWidth = 3.5 * carWidth;
      const x = -0.5 * marginedWidth + row * marginedWidth;
      const z = -2 * marginedLength + col * marginedLength;
      staticCarPositions.push([x, 5, z]);
    }
  }
  const staticCars = staticCarPositions.map((position: NumVec3, index: number) => {
    return (
      <Car
        key={index}
        position={position}
        wireframe={false}
        controllable={false}
        styled={false}
      />
    );
  });

  return (
    <div style={{ height: `600px` }}>
      <Canvas
        camera={{ position: [-10, 10, 0], fov: 50 }}
        shadows
      >
        <OrbitControls />
        <color attach="background" args={['lightblue']} />
        {/*<color attach="background" args={['lightgreen']} />*/}
        <hemisphereLight intensity={1} groundColor={new THREE.Color( 0x080820 )} />
        <spotLight
          position={[-10, 20, 10]}
          angle={0.8}
          penumbra={1}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <Physics
          step={1 / 60}
          gravity={[0, -10, 0]}
          iterations={10}
          defaultContactMaterial={{
            friction: 0.001,
            restitution: 0.01,
            contactEquationRelaxation: 4,
          }}
          broadphase="SAP"
          allowSleep
        >
          <Ground userData={{ id: 'ground' }} />
          {activeCar}
          {staticCars}
          {/*<Pillar position={[-5, 2.5, -5]} userData={{ id: 'pillar-1' }} />*/}
          {/*<Pillar position={[0, 2.5, -5]} userData={{ id: 'pillar-2' }} />*/}
          {/*<Pillar position={[5, 2.5, -5]} userData={{ id: 'pillar-3' }} />*/}
        </Physics>
      </Canvas>
    </div>
  );
}

export default ParkingLot;
