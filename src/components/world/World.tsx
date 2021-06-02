import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment} from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { styled } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { Block } from 'baseui/block';
import CarJoystickController from './controllers/CarJoystickController';
import CarKeyboardController from './controllers/CarKeyboardController';
import { WORLD_CONTAINER_HEIGHT } from './constants/world';

type WorldProps = {
  children: React.ReactNode,
  withJoystickControl?: boolean,
  withKeyboardControl?: boolean,
};

function World(props: WorldProps) {
  const {
    children,
    withJoystickControl = false,
    withKeyboardControl = false,
  } = props;

  const [showPerfStat, setShowPerfStat] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search.substring(1));
    if (searchParams.get('debug')) {
      setShowPerfStat(true);
    }
  }, []);

  const stats = showPerfStat ? (
    <Stats showPanel={0} />
  ) : null;

  const preLoader = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      boxSizing: 'border-box',
      height: `${WORLD_CONTAINER_HEIGHT}px`,
      borderStyle: 'dashed',
      borderColor: 'rgb(220, 220, 220)',
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    }}>
      <Spinner color="black" />
    </div>
  );

  const joystickController = withJoystickControl ? (
    <CarJoystickController />
  ) : null;

  const keyboardController = withKeyboardControl ? (
    <CarKeyboardController />
  ) : null;

  return (
    <Block position="relative" overflow="hidden" display="block" height={`${WORLD_CONTAINER_HEIGHT}px`}>
      {preLoader}
      <WorldContainer>
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
            <Environment background={false} preset={'night'} />
            {children}
          </Physics>
        </Canvas>
      </WorldContainer>
      {joystickController}
      {keyboardController}
      {stats}
    </Block>
  );
}

const WorldContainer = styled('div', {
  height: `${WORLD_CONTAINER_HEIGHT}px`,
  boxSizing: 'border-box',
  borderStyle: 'dashed',
  borderColor: 'rgb(220, 220, 220)',
  borderWidth: 0,
});

export default World;
