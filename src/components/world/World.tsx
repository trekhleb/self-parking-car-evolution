import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment} from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { Checkbox } from 'baseui/checkbox';

type WorldProps = {
  children: React.ReactNode,
};

function World(props: WorldProps) {
  const { children } = props;

  const [debug, setDebug] = useState<boolean>(false);

  const stats = debug ? (
    <Stats showPanel={0} />
  ) : null;

  const controls = (
    <div>
      <Checkbox
        checked={debug}
        onChange={(e: any) => setDebug(e?.target?.checked)}
      >
        Stats
      </Checkbox>
    </div>
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {controls}
      <Canvas
        camera={{ position: [-10, 10, 0], fov: 50 }}
        shadows
      >
        {stats}
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
    </div>
  );
}

export default World;
