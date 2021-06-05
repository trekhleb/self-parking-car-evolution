import React, { forwardRef, useRef } from 'react';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';

import { NumVec3 } from '../types/vectors';
import { Intersection } from 'three/src/core/Raycaster';
import { CHASSIS_OBJECT_NAME, SENSOR_DISTANCE } from './constants';
import { userCarUUID } from '../types/car';

type SensorRayProps = {
  carUUID: userCarUUID,
  from: NumVec3,
  to: NumVec3,
  beamColor?: THREE.Color,
  beamWarningColor?: THREE.Color,
  beamDangerColor?: THREE.Color,
  lineWidth?: number,
};

const SensorRay = forwardRef<Line2 | undefined, SensorRayProps>((props, beamRef) => {
  const {
    carUUID,
    from,
    to,
    beamColor = new THREE.Color(0x009900),
    beamWarningColor = new THREE.Color(0xFFFF00),
    beamDangerColor = new THREE.Color(0xFF0000),
    lineWidth = 0.5,
  } = props;

  const lineRef = useRef<Line2>();

  useFrame((state: RootState, delta: number) => {
    // return;
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
