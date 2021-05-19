import React, { useCallback, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';

import Ground from './Ground';
import Car from './Car/Car';
import { NumVec3 } from '../../types/vectors';
import { CHASSIS_BASE_COLOR, CHASSIS_BASE_TOUCHED_COLOR, CHASSIS_HEIGHT } from './Car/parameters';

type CarBaseColors = Record<string, string>;

// Collision groups and masks must be powers of 2.
// @see: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
const COLLISION_GROUP_ACTIVE_CARS = 0b0001;
const COLLISION_GROUP_STATIC_OBJECTS = 0b0010;
const COLLISION_MASK_ACTIVE_CARS = COLLISION_GROUP_STATIC_OBJECTS // It can only collide with static objects.

function ParkingLot() {
  const [carBaseColors, setCarBaseColors] = useState<CarBaseColors>({});
  const carBaseColorsRef = useRef<CarBaseColors>({});

  const onCollide = (event: any) => {
    const touchedCarUUID = event?.body?.userData?.uuid;
    if (!touchedCarUUID) {
      return;
    }
    const newCarBaseColors = {
      ...carBaseColorsRef.current,
      [touchedCarUUID]: CHASSIS_BASE_TOUCHED_COLOR,
    };
    carBaseColorsRef.current = newCarBaseColors;
    setCarBaseColors(newCarBaseColors);
    console.log('Bonk!', event.body.userData);
  };

  const onCollideCallback = useCallback(onCollide, [carBaseColors]);

  const activeCarsNum = 10;
  const activeCars = new Array(activeCarsNum).fill(null).map((_, index) => {
    const uuid = `car-population-${index}`;
    // const position = [0, 3 + 3 * index * CHASSIS_HEIGHT, 4 * Math.random() - 2];
    const position = [0, 3 + 2 * Math.random(), 4 * Math.random() - 2];
    const angularVelocity = [-0.2, 0, 0];
    return (
      <Car
        key={index}
        uuid={uuid}
        bodyProps={{
          position,
          angularVelocity,
        }}
        onCollide={onCollideCallback}
        wireframe={false}
        collisionFilterGroup={COLLISION_GROUP_ACTIVE_CARS}
        collisionFilterMask={COLLISION_MASK_ACTIVE_CARS}
        controllable
        movable
        styled
      />
    );
  });

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
      staticCarPositions.push([x, 0.6, z]);
    }
  }
  const staticCars = staticCarPositions.map((position: NumVec3, index: number) => {
    const uuid = `car-static-${index}`;
    const baseColor = uuid in carBaseColors ? carBaseColors[uuid] : CHASSIS_BASE_COLOR;
    return (
      <Car
        key={index}
        uuid={uuid}
        bodyProps={{ position }}
        wireframe={false}
        controllable={false}
        styled={false}
        movable={false}
        baseColor={baseColor}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
      />
    );
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas
        camera={{ position: [-10, 10, 0], fov: 50 }}
        shadows
      >
        <OrbitControls />
        <color attach="background" args={['lightblue']} />
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
          <Ground userData={{ id: 'ground' }} collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS} />
          {activeCars}
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
