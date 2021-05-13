import React, { forwardRef } from 'react';
import { useCylinder, CylinderProps, } from '@react-three/cannon';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { getModelPath } from '../../utils/models';
import { NumVec3, NumVec4 } from '../../types/vectors';

const modelPath = getModelPath('wheel.glb');

// @TODO: Do this in global space, not inside a component!
// @see: https://github.com/pmndrs/drei#usegltf
useGLTF.preload(modelPath);

type WheelModelProps = {
  castShadow?: boolean,
  receiveShadow?: boolean,
  groupProps?: GroupProps,
};

function WheelModel(props: WheelModelProps) {
  const { castShadow = true, receiveShadow = true, groupProps = {} } = props;

  const { nodes, materials } = useGLTF(modelPath);

  // @ts-ignore
  const tire = nodes.wheel_1.geometry;
  // @ts-ignore
  const disc = nodes.wheel_2.geometry;
  // @ts-ignore
  const cap = nodes.wheel_3.geometry;

  return (
    <group {...groupProps} dispose={null}>
      <mesh material={materials.Rubber} geometry={tire} castShadow={castShadow} receiveShadow={receiveShadow} />
      <mesh material={materials.Steel} geometry={disc} castShadow={castShadow} receiveShadow={receiveShadow} />
      <mesh material={materials.Chrom} geometry={cap} castShadow={castShadow} receiveShadow={receiveShadow} />
    </group>
  )
}

type WheelProps = {
  radius: number,
  isLeft?: boolean,
  bodyProps?: CylinderProps,
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const { radius, isLeft = false, bodyProps = {} } = props;

  const mass = 1;
  const width = 0.5;
  const segments = 16;

  const castShadow = true;
  const receiveShadow = true;

  const wheelSize: NumVec4 = [radius, radius, width, segments];

  // The rotation should be applied to the shape (not the body).
  const rotation: NumVec3 = [0, 0, ((isLeft ? 1 : -1) * Math.PI) / 2];

  useCylinder(
    () => ({
      mass,
      type: 'Kinematic',
      collisionFilterGroup: 0,
      args: wheelSize,
      ...bodyProps,
    }),
    // @ts-ignore
    ref,
  )

  return (
    <mesh ref={ref}>
      <mesh rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow}>
        <WheelModel castShadow={castShadow} receiveShadow={receiveShadow} />
      </mesh>
    </mesh>
  )
})

export default Wheel;
