import * as THREE from 'three';
import { Material } from 'three/src/materials/Material';
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial';

const baseColor = '#FFFFFF';

export const getSteel = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.5,
    ...props,
  });
};

export const getRubber = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    ...props,
  });
};
