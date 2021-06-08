import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { MeshBVH } from 'three-mesh-bvh';

import { ModelData } from '../types/models';
import { getPlastic, getRubber, getSteel, getGlass } from '../utils/materials';
import { CHASSIS_MODEL_PATH } from './constants';

// Preview the model: https://sandbox.babylonjs.com/
// @see: https://github.com/pmndrs/drei#usegltf
// useGLTF.preload(CHASSIS_MODEL_PATH);

type ChassisModelProps = {
  bodyProps?: GroupProps,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
  baseColor?: string,
};

function ChassisModel(props: ChassisModelProps) {
  const {
    bodyProps = {},
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    baseColor: color,
  } = props;

  const { nodes, materials }: ModelData = useGLTF(CHASSIS_MODEL_PATH);

  Object.keys(nodes).forEach((geometryKey) => {
    if (geometryKey.startsWith('chassis_')) {
      // @ts-ignore
      nodes[geometryKey].geometry.boundsTree = new MeshBVH(nodes[geometryKey].geometry);
    }
  });

  return (
    <group {...bodyProps}>
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Black paint'] : getSteel({wireframe, color: '#000000'})}
        geometry={nodes.chassis_1.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Rubber'] : getRubber({wireframe, color: '#000000'})}
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
        material={styled ? materials['Underbody'] : getSteel({wireframe, color: '#000000'})}
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
        material={styled ? materials['Interior (dark)'] : getPlastic({wireframe, color: '#000000'})}
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
        material={styled ? materials['Reflector'] : getPlastic({wireframe, color})}
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
        material={styled ? materials['Black plastic'] : getPlastic({wireframe, color: '#000000'})}
        geometry={nodes.chassis_11.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Headlight'] : getGlass({wireframe, color})}
        geometry={nodes.chassis_12.geometry}
      />
      <mesh
        receiveShadow={receiveShadow}
        castShadow={castShadow}
        material={styled ? materials['Reverse lights'] : getGlass({wireframe, color})}
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
        material={styled ? materials['Tail lights'] : getGlass({wireframe, color})}
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

export default ChassisModel;
