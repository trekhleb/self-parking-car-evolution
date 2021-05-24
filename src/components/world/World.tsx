import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment} from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { Checkbox } from 'baseui/checkbox';
import { styled } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { Block } from 'baseui/block';
import ReactNipple from 'react-nipple';

type WorldProps = {
  children: React.ReactNode,
  withNipple?: boolean,
};

const WORLD_CONTAINER_HEIGHT = 400;

function World(props: WorldProps) {
  const { children, withNipple = false } = props;

  const [showPerfStat, setShowPerfStat] = useState<boolean>(false);

  const stats = showPerfStat ? (
    <Stats showPanel={0} />
  ) : null;

  const controls = (
    <div style={{ marginTop: '15px' }}>
      <Checkbox
        checked={showPerfStat}
        onChange={(e: any) => setShowPerfStat(e?.target?.checked)}
      >
        Perf stats
      </Checkbox>
    </div>
  );

  const preLoader = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      height: `${WORLD_CONTAINER_HEIGHT}px`,
    }}>
      <Spinner color="black" />
    </div>
  );

  const nippleSize = 100;
  const nipple = withNipple ? (
    <ReactNipple
      style={{
        width: nippleSize,
        height: nippleSize,
        marginTop: -nippleSize - 20,
        marginLeft: `calc(50% - ${Math.floor(nippleSize / 2)}px)`,
        position: 'absolute',
      }}
      // @see: https://github.com/yoannmoinet/nipplejs#options
      options={{
        color: 'white',
        mode: 'static',
        size: nippleSize,
        position: { top: '50%', left: '50%' }
      }}
      // @see: https://github.com/yoannmoinet/nipplejs#start
      onMove={(evt: any, data: any) => console.log(data.direction)}
      onEnd={(evt: any, data: any) => console.log('end')}
    />
  ) : null;

  return (
    <Block position="relative">
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
        {nipple}
      </WorldContainer>
      {controls}
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
