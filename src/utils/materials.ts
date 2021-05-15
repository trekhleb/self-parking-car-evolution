import * as THREE from 'three';
import { Material } from 'three/src/materials/Material';
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial';
import { MeshPhysicalMaterialParameters } from 'three';

const baseColor = '#FFFFFF';

export const getSteel = (props: MeshPhysicalMaterialParameters): Material => {
  return new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 0.05,
    clearcoatRoughness: 0.05,
    ...props,
  });
};

export const getRubber = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    ...props,
  });
};

export const getPlastic = (props: MeshStandardMaterialParameters): Material => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    ...props,
  });
};

export const getGlass = (props: MeshPhysicalMaterialParameters): Material => {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    ...props,
  });
};
