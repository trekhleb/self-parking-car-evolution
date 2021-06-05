import React, { forwardRef, useEffect, useRef } from 'react';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import { Intersection } from 'three/src/core/Raycaster';

import { NumVec3 } from '../types/vectors';
import { userCarUUID } from '../types/car';
import { CHASSIS_OBJECT_NAME, SENSOR_DISTANCE } from './constants';

const beamColor = new THREE.Color(0x009900);
const beamWarningColor = new THREE.Color(0xFFFF00);
const beamDangerColor = new THREE.Color(0xFF0000);
const lineWidth = 0.5;

type SensorRayProps = {
  carUUID: userCarUUID,
  to: NumVec3,
  from: NumVec3,
  angleX: number,
  obstacles?: THREE.Object3D[],
};

const SensorRay = forwardRef<Line2 | undefined, SensorRayProps>((props, beamRef) => {
  const {
    carUUID,
    to,
    from,
    angleX,
    obstacles = [],
  } = props;

  const lineRef = useRef<Line2>();

  useFrame((state: RootState, delta: number) => {
    if (!lineRef?.current) {
      return;
    }

    const position = new THREE.Vector3();
    const direction = new THREE.Vector3();

    lineRef.current.getWorldPosition(position);
    lineRef.current.getWorldDirection(direction);

    const raycaster = new THREE.Raycaster(position, direction, 0, SENSOR_DISTANCE);

    // @ts-ignore
    const objects: Object3D[] = state.scene.children
      .filter((object: THREE.Object3D) => object.type === 'Group')
      .map((object: THREE.Object3D) => object.getObjectByName(CHASSIS_OBJECT_NAME))
      .filter((object: THREE.Object3D | undefined) => object && object.userData.uuid !== carUUID);

    const intersection: Intersection[] = raycaster.intersectObjects(objects, true);
    const distance = intersection.length ? intersection[0].distance : undefined;

    if (distance === undefined) {
      lineRef.current.material.color = beamColor;
    } else if (distance > (SENSOR_DISTANCE - SENSOR_DISTANCE / 4)) {
      lineRef.current.material.color = beamWarningColor;
    } else {
      lineRef.current.material.color = beamDangerColor;
    }

    // debugger
  });

  useEffect(() => {
    if (!lineRef.current) {
      return;
    }
    lineRef.current.rotateY(angleX);
  }, [angleX]);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ]);

  return (
    <group>
      {/* @ts-ignore */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          attach="material"
          color={beamColor}
          linewidth={lineWidth}
        />
      </line>
    </group>
  )
});

export default SensorRay;
