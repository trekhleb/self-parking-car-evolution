import { BoxProps, useBox } from '@react-three/cannon';
import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { getModelPath } from '../../utils/models';
import { ModelData } from '../../types/models';
import { getPlastic, getRubber, getSteel, getGlass } from '../../utils/materials';
import { CHASSIS_MASS, CHASSIS_SIZE } from './parameters';
import { NumVec3 } from '../../types/vectors';

const modelPath = getModelPath('beetle.glb');

// @TODO: Do this in global space, not inside a component!
// @see: https://github.com/pmndrs/drei#usegltf
useGLTF.preload(modelPath);

type ChassisProps = {
  weight?: number,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
  movable?: boolean,
  baseColor?: string,
  chassisPosition: NumVec3,
  bodyProps: BoxProps,
  onCollide?: (event: any) => void,
  userData?: Record<string, any>,
}

type BeetleProps = {
  bodyProps?: GroupProps,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
  baseColor?: string,
};

function Beetle(props: BeetleProps) {
  const {
    bodyProps = {},
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    baseColor: color,
  } = props;

  const { nodes, materials }: ModelData = useGLTF(modelPath)

  return (
    <group {...bodyProps} dispose={null}>
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Black paint'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_1.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Rubber'] : getRubber({wireframe, color})}
        geometry={nodes.chassis_2.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Paint'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_3.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Underbody'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_4.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Chrom'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_5.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Interior (dark)'] : getPlastic({wireframe, color})}
        geometry={nodes.chassis_6.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Interior (light)'] : getPlastic({wireframe, color})}
        geometry={nodes.chassis_7.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Reflector'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_8.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Glass'] : getGlass({wireframe, color})}
        geometry={nodes.chassis_9.geometry} />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Steel'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_10.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Black plastic'] : getPlastic({wireframe, color})}
        geometry={nodes.chassis_11.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Headlight'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_12.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Reverse lights'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_13.geometry} />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Orange plastic'] : getPlastic({wireframe, color})}
        geometry={nodes.chassis_14.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Tail lights'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_15.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['License Plate'] : getSteel({wireframe, color})}
        geometry={nodes.chassis_16.geometry}
      />
    </group>
  )
}

// The vehicle chassis
const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const {
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    movable = true,
    weight = CHASSIS_MASS,
    baseColor,
    chassisPosition,
    bodyProps,
    userData = {},
    onCollide = (event) => {},
  } = props;

  const boxSize = CHASSIS_SIZE;
  useBox(
    () => ({
      mass: weight,
      allowSleep: false,
      args: boxSize,
      onCollide,
      userData,
      type: movable ? 'Dynamic' : 'Static',
      ...bodyProps,
    }),
    // @ts-ignore
    ref
  )

  const groupProps: GroupProps = {
    position: chassisPosition,
  };

  return (
    <mesh ref={ref}>
      <Beetle
        bodyProps={groupProps}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        wireframe={wireframe}
        styled={styled}
        baseColor={baseColor}
      />
    </mesh>
  )
})

export default Chassis;
