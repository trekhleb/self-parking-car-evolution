import { BoxProps, useBox } from '@react-three/cannon';
import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

import { getModelPath } from '../../utils/models';
import { ModelData } from '../../types/models';
import { getPlastic, getRubber, getSteel, getGlass } from '../../utils/materials';

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
  movable?: boolean,
  baseColor?: string,
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
    rotation,
    angularVelocity,
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    movable = true,
    weight = 500,
    baseColor,
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
      type: movable ? 'Dynamic' : 'Static',
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
        baseColor={baseColor}
      />
    </mesh>
  )
})

export default Chassis;
