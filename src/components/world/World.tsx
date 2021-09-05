import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment, AdaptiveDpr, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { styled, withStyle } from 'baseui';
import { StyledSpinnerNext } from 'baseui/spinner';
import { Block } from 'baseui/block';

import CarJoystickController from './controllers/CarJoystickController';
import CarKeyboardController from './controllers/CarKeyboardController';
import { WIDER_CAMERA_SCREEN_MAX_WIDTH, WORLD_CONTAINER_HEIGHT } from './constants/world';
import FadeIn from '../shared/FadeIn';
import { getSearchParam } from '../../utils/url';

type WorldProps = {
  children: React.ReactNode,
  withJoystickControl?: boolean,
  withKeyboardControl?: boolean,
  version?: string,
  performanceBoost?: boolean, 
};

const worldBackgroundColor = 'lightblue';

const WorldSpinner = withStyle(StyledSpinnerNext, {
  width: '30px',
  height: '30px',
  borderLeftWidth: '6px',
  borderRightWidth: '6px',
  borderTopWidth: '6px',
  borderBottomWidth: '6px',
  borderTopColor: 'black',
});

const STAT_SEARCH_PARAM_NAME = 'debug';

function World(props: WorldProps) {
  const {
    children,
    withJoystickControl = false,
    withKeyboardControl = false,
    version = '0',
    performanceBoost = false,
  } = props;

  const [withStat] = useState<boolean>(!!getSearchParam(STAT_SEARCH_PARAM_NAME));

  const stats = withStat ? (
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
      backgroundColor: worldBackgroundColor,
    }}>
      <FadeIn>
        <WorldSpinner />
      </FadeIn>
    </div>
  );

  const joystickController = withJoystickControl ? (
    <CarJoystickController />
  ) : null;

  const keyboardController = withKeyboardControl ? (
    <CarKeyboardController />
  ) : null;

  const cameraFov = window.innerWidth < WIDER_CAMERA_SCREEN_MAX_WIDTH ? 30 : 25;

  const environment = performanceBoost ? null : (
    <Environment background={false} preset={'night'} />
  );

  return (
    <Block position="relative" overflow="hidden" display="block" height={`${WORLD_CONTAINER_HEIGHT}px`}>
      {preLoader}
      <WorldContainer>
        <Canvas shadows key={version}>
          <PerspectiveCamera
            makeDefault
            fov={cameraFov}
            position={[-20, 20, 0]}
          />
          <OrbitControls />
          <color attach="background" args={[worldBackgroundColor]} />
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
              friction: 0.01,
              restitution: 0.01,
              contactEquationRelaxation: 4,
            }}
            broadphase="SAP"
            allowSleep
          >
            {environment}
            {children}
          </Physics>

          {/* @see: https://docs.pmnd.rs/drei/performance/adaptive-dpr */}
          <AdaptiveDpr pixelated />
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
