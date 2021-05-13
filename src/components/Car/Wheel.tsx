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

type WheelProps = {
  radius?: number,
  isLeft?: boolean,
  bodyProps?: CylinderProps,
}

function WheelModel(props: GroupProps) {
  const { nodes, materials } = useGLTF(modelPath);

  // @ts-ignore
  const g1 = nodes.wheel_1.geometry;
  // @ts-ignore
  const g2 = nodes.wheel_2.geometry;
  // @ts-ignore
  const g3 = nodes.wheel_3.geometry;

  return (
    <group {...props} dispose={null}>
      <mesh material={materials.Rubber} geometry={g1} castShadow receiveShadow />
      <mesh material={materials.Steel} geometry={g2} castShadow receiveShadow />
      <mesh material={materials.Chrom} geometry={g3} castShadow receiveShadow />
    </group>
  )
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const { radius = 0.7, isLeft = false, bodyProps = {} } = props;

  const mass = 1;
  const width = 0.5;
  const segments = 16;

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
      <mesh rotation={rotation} castShadow receiveShadow>
        <WheelModel />
      </mesh>
    </mesh>
  )
})

export default Wheel;
