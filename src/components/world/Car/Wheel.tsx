import React, { forwardRef } from 'react';
import { useCylinder, CylinderProps, } from '@react-three/cannon';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { NumVec3, NumVec4 } from '../../../types/vectors';
import { ModelData } from '../../../types/models';
import { getRubber, getSteel } from '../../../utils/materials';
import { WHEEL_MASS, WHEEL_MODEL_PATH, WHEEL_WIDTH } from './parameters';

// Preview the model.
// @see: https://github.com/pmndrs/drei#usegltf
// useGLTF.preload(WHEEL_MODEL_PATH);

type WheelModelProps = {
  castShadow?: boolean,
  receiveShadow?: boolean,
  groupProps?: GroupProps,
  styled?: boolean,
  wireframe?: boolean,
  baseColor?: string,
};

function WheelModel(props: WheelModelProps) {
  const {
    castShadow = true,
    receiveShadow = true,
    groupProps = {},
    styled = true,
    wireframe = false,
    baseColor: color,
  } = props;

  const { nodes, materials }: ModelData = useGLTF(WHEEL_MODEL_PATH);

  const tire = nodes.wheel_1?.geometry;
  const disc = nodes.wheel_2?.geometry;
  const cap = nodes.wheel_3?.geometry;

  const tireMaterial = styled
    ? materials.Rubber
    : getRubber({ wireframe, color });

  // const discMaterial = styled
  //   ? materials.Steel
  //   : getSteel({ wireframe });

  const discMaterial = getSteel({ wireframe, color });

  const capMaterial = styled
    ? materials.Chrom
    : getSteel({ wireframe, color });

  return (
    <group {...groupProps} dispose={null}>
      <mesh
        geometry={tire}
        material={tireMaterial}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
      <mesh
        geometry={disc}
        material={discMaterial}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
      <mesh
        geometry={cap}
        material={capMaterial}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
    </group>
  )
}

type WheelProps = {
  radius: number,
  mass?: number,
  width?: number,
  segments?: number,
  castShadow?: boolean,
  receiveShadow?: boolean,
  isLeft?: boolean,
  styled?: boolean,
  wireframe?: boolean,
  baseColor?: string,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  bodyProps?: CylinderProps,
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const {
    radius,
    width = WHEEL_WIDTH,
    mass = WHEEL_MASS,
    segments = 16,
    collisionFilterGroup = 0,
    collisionFilterMask,
    castShadow = true,
    receiveShadow = true,
    isLeft = false,
    styled = true,
    wireframe = false,
    bodyProps = {},
    baseColor,
  } = props;

  const wheelSize: NumVec4 = [radius, radius, width, segments];

  // The rotation should be applied to the shape (not the body).
  const rotation: NumVec3 = [0, 0, ((isLeft ? 1 : -1) * Math.PI) / 2];

  useCylinder(
    () => ({
      mass,
      type: 'Kinematic',
      collisionFilterGroup: 0,
      collisionFilterMask: 0,
      args: wheelSize,
      ...bodyProps,
    }),
    // @ts-ignore
    ref,
  )

  return (
    <mesh ref={ref}>
      <mesh rotation={rotation}>
        <WheelModel
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
        />
      </mesh>
    </mesh>
  )
})

export default Wheel;
