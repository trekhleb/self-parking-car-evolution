import { BoxProps, useBox } from '@react-three/cannon';
import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { getModelPath } from '../../utils/models';
import { ModelData } from '../../types/models';

const modelPath = getModelPath('beetle.glb');

// @TODO: Do this in global space, not inside a component!
// @see: https://github.com/pmndrs/drei#usegltf
useGLTF.preload(modelPath);

export interface ChassisProps extends BoxProps {
  weight?: number,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
}

const onCollide = (e: any) => {
  // the other body:
  console.log('Bonk!', e.body.userData)
}

type BeetleProps = {
  bodyProps?: GroupProps,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
};

function Beetle(props: BeetleProps) {
  const {
    bodyProps = {},
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
  } = props;

  const { nodes, materials }: ModelData = useGLTF(modelPath)

  return (
    <group {...bodyProps} dispose={null}>
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Black paint']}
        geometry={nodes.chassis_1.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Rubber']}
        geometry={nodes.chassis_2.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Paint']}
        geometry={nodes.chassis_3.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Underbody']}
        geometry={nodes.chassis_4.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Chrom']}
        geometry={nodes.chassis_5.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Interior (dark)']}
        geometry={nodes.chassis_6.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Interior (light)']}
        geometry={nodes.chassis_7.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Reflector']}
        geometry={nodes.chassis_8.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Glass']}
        geometry={nodes.chassis_9.geometry} />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Steel']}
        geometry={nodes.chassis_10.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Black plastic']}
        geometry={nodes.chassis_11.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Headlight']}
        geometry={nodes.chassis_12.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Reverse lights']}
        geometry={nodes.chassis_13.geometry} />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Orange plastic']}
        geometry={nodes.chassis_14.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['Tail lights']}
        geometry={nodes.chassis_15.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={materials['License Plate']}
        geometry={nodes.chassis_16.geometry}
      />
    </group>
  )
}

// The vehicle chassis
const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const {
    rotation,
    angularVelocity,
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    weight = 500,
  } = props;

  const boxSize = [1.7, 1, 4] // roughly the cars' visual dimensions
  useBox(
    () => ({
      mass: weight,
      rotation,
      angularVelocity,
      allowSleep: false,
      args: boxSize,
      onCollide,
      userData: {
        id: 'vehicle-chassis',
      },
      ...props,
    }),
    // @ts-ignore
    ref
  )

  const bodyProps: GroupProps = {
    position: [0, -0.6, 0],
  };

  return (
    <mesh ref={ref}>
      <Beetle
        bodyProps={bodyProps}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        wireframe={wireframe}
        styled={styled}
      />
    </mesh>
  )
})

export default Chassis;
