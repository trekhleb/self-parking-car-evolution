import React, { forwardRef } from 'react';
import { useCylinder, CylinderProps, } from '@react-three/cannon';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { getModelPath } from '../../utils/models';

const modelPath = getModelPath('wheel.glb');

useGLTF.preload(modelPath)

interface WheelProps extends CylinderProps {
  radius?: number,
  leftSide?: boolean,
}

function WheelModel(props: GroupProps) {
  const { nodes, materials } = useGLTF(modelPath)
  // Might be nodes.wheel_primitive0.geometry, nodes.wheel_primitive1.geometry, nodes.wheel_primitive1.geometry
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
  const size = props.radius || 0.7
  const wheelSize = [size, size, 0.5, 16]
  const isLeftSide = props.leftSide || false // mirrors geometry

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

  return (
    <mesh ref={ref}>
      <mesh rotation={[0, 0, ((isLeftSide ? 1 : -1) * Math.PI) / 2]} castShadow>
        <WheelModel />
      </mesh>
    </mesh>
  )
})

export default Wheel;
