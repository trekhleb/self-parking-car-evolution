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

interface WheelProps extends CylinderProps {
  radius: number,
  width?: number,
  isLeftSide?: boolean,
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
      <mesh material={materials.Rubber} geometry={g1} />
      <mesh material={materials.Steel} geometry={g2} />
      <mesh material={materials.Chrom} geometry={g3} />
    </group>
  )
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const { radius, width = 0.5, isLeftSide = false } = props;

  const wheelSize: NumVec4 = [radius, radius, width, 16];

  useCylinder(
    () => ({
      mass: 1,
      type: 'Kinematic',
      // material: 'wheel',
      collisionFilterGroup: 0, // turn off collisions, or turn them on if you want to fly!
      // the rotation should be applied to the shape (not the body)
      args: wheelSize,
      ...props,
    }),
    // @ts-ignore
    ref,
  )

  const rotation: NumVec3 = [0, 0, ((isLeftSide ? 1 : -1) * Math.PI) / 2];

  return (
    <mesh ref={ref}>
      <mesh rotation={rotation} castShadow>
        <WheelModel />
      </mesh>
    </mesh>
  )
})

export default Wheel;
