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
}

const onCollide = (e: any) => {
  // the other body:
  console.log('Bonk!', e.body.userData)
}

function Beetle(props: GroupProps) {
  const { nodes, materials }: ModelData = useGLTF(modelPath)

  const g1 = nodes.chassis_1.geometry;
  const g2 = nodes.chassis_2.geometry;
  const g3 = nodes.chassis_3.geometry;
  const g4 = nodes.chassis_4.geometry;
  const g5 = nodes.chassis_5.geometry;
  const g6 = nodes.chassis_6.geometry;
  const g7 = nodes.chassis_7.geometry;
  const g8 = nodes.chassis_8.geometry;
  const g9 = nodes.chassis_9.geometry;
  const g10 = nodes.chassis_10.geometry;
  const g11 = nodes.chassis_11.geometry;
  const g12 = nodes.chassis_12.geometry;
  const g13 = nodes.chassis_12.geometry;
  const g14 = nodes.chassis_14.geometry;
  const g15 = nodes.chassis_15.geometry;
  const g16 = nodes.chassis_16.geometry;

  return (
    <group {...props} dispose={null}>
      <mesh receiveShadow castShadow material={materials['Black paint']} geometry={g1} />
      <mesh receiveShadow castShadow material={materials['Rubber']} geometry={g2} />
      <mesh receiveShadow castShadow material={materials['Paint']} geometry={g3} />
      <mesh receiveShadow castShadow material={materials['Underbody']} geometry={g4} />
      <mesh receiveShadow castShadow material={materials['Chrom']} geometry={g5} />
      <mesh receiveShadow castShadow material={materials['Interior (dark)']} geometry={g6} />
      <mesh receiveShadow castShadow material={materials['Interior (light)']} geometry={g7} />
      <mesh receiveShadow castShadow material={materials['Reflector']} geometry={g8} />
      <mesh receiveShadow castShadow material={materials['Glass']} geometry={g9} />
      <mesh receiveShadow castShadow material={materials['Steel']} geometry={g10} />
      <mesh receiveShadow castShadow material={materials['Black plastic']} geometry={g11} />
      <mesh receiveShadow castShadow material={materials['Headlight']} geometry={g12} />
      <mesh receiveShadow castShadow material={materials['Reverse lights']} geometry={g13} />
      <mesh receiveShadow castShadow material={materials['Orange plastic']} geometry={g14} />
      <mesh receiveShadow castShadow material={materials['Tail lights']} geometry={g15} />
      <mesh receiveShadow castShadow material={materials['License Plate']} geometry={g16} />
    </group>
  )
}

// The vehicle chassis
const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const boxSize = [1.7, 1, 4] // roughly the cars' visual dimensions
  useBox(
    () => ({
      mass: props.weight || 500,
      rotation: props.rotation,
      angularVelocity: props.angularVelocity,
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

  return (
    <mesh ref={ref}>
      <Beetle position={[0, -0.6, 0]} />
    </mesh>
  )
})

export default Chassis;
