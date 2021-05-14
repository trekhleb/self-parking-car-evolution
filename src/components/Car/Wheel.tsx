import React, { forwardRef } from 'react';
import { useCylinder, CylinderProps, } from '@react-three/cannon';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { getModelPath } from '../../utils/models';
import { NumVec3, NumVec4 } from '../../types/vectors';
import { ModelData } from '../../types/models';

const modelPath = getModelPath('wheel.glb');

// @TODO: Do this in global space, not inside a component!
// @see: https://github.com/pmndrs/drei#usegltf
useGLTF.preload(modelPath);

type WheelModelProps = {
  castShadow?: boolean,
  receiveShadow?: boolean,
  groupProps?: GroupProps,
  styled?: boolean,
};

function WheelModel(props: WheelModelProps) {
  const { castShadow = true, receiveShadow = true, groupProps = {}, styled = false } = props;

  const { nodes, materials }: ModelData = useGLTF(modelPath);

  const tire = nodes.wheel_1?.geometry;
  const disc = nodes.wheel_2?.geometry;
  const cap = nodes.wheel_3?.geometry;

  const steel = styled
    ? materials.Steel
    : new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      metalness: 0.5,
      roughness: 0.1,
    });

  return (
    <group {...groupProps} dispose={null}>
      <mesh material={materials.Rubber} geometry={tire} castShadow={castShadow} receiveShadow={receiveShadow} />
      <mesh material={steel} geometry={disc} castShadow={castShadow} receiveShadow={receiveShadow} />
      <mesh material={materials.Chrom} geometry={cap} castShadow={castShadow} receiveShadow={receiveShadow} />
    </group>
  )
}

type WheelProps = {
  radius: number,
  mass?: number,
  width?: number,
  segments?: number,
  collisionFilterGroup?: number,
  castShadow?: boolean,
  receiveShadow?: boolean,
  isLeft?: boolean,
  bodyProps?: CylinderProps,
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const {
    radius,
    width = 0.5,
    mass = 1,
    segments = 16,
    collisionFilterGroup = 0,
    castShadow = true,
    receiveShadow = true,
    isLeft = false,
    bodyProps = {},
  } = props;

  const wheelSize: NumVec4 = [radius, radius, width, segments];

  // The rotation should be applied to the shape (not the body).
  const rotation: NumVec3 = [0, 0, ((isLeft ? 1 : -1) * Math.PI) / 2];

  useCylinder(
    () => ({
      mass,
      type: 'Kinematic',
      collisionFilterGroup,
      args: wheelSize,
      ...bodyProps,
    }),
    // @ts-ignore
    ref,
  )

  return (
    <mesh ref={ref}>
      <mesh rotation={rotation}>
        <WheelModel castShadow={castShadow} receiveShadow={receiveShadow} />
      </mesh>
    </mesh>
  )
})

export default Wheel;
