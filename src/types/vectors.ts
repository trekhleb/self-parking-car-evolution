import * as THREE from 'three';

export type NumVec2 = [number, number];
export type NumVec3 = [number, number, number];
export type NumVec4 = [number, number, number, number];

export type RectanglePoints = {
  fl: NumVec3, // Front-left
  fr: NumVec3, // Front-right
  bl: NumVec3, // Back-left
  br: NumVec3, // Back-right
};

export type ThreeRectanglePoints = {
  fl: THREE.Vector3, // Front-left
  fr: THREE.Vector3, // Front-right
  bl: THREE.Vector3, // Back-left
  br: THREE.Vector3, // Back-right
};
