import * as THREE from 'three';
import { Material } from 'three/src/materials/Material';
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial';
import { MeshPhysicalMaterialParameters } from 'three';

export const getSteel = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0,
    ...props,
  });
};

export const getRubber = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    ...props,
  });
};

export const getPlastic = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    ...props,
  });
};

export const getGlass = (props: MeshPhysicalMaterialParameters): Material => {
  return new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    ...props,
  });
};
