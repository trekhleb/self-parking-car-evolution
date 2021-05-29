import * as THREE from 'three';

interface ExtendedObject3D extends THREE.Object3D {
  geometry?: THREE.BufferGeometry,
}

export type ModelData = {
  nodes: {
    [name: string]: ExtendedObject3D;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};
