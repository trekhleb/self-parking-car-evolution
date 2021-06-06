import React, { forwardRef, useEffect, useRef } from 'react';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import { Intersection } from 'three/src/core/Raycaster';

import { NumVec3 } from '../types/vectors';
import { SENSOR_DISTANCE } from './constants';

const beamColor = new THREE.Color(0x009900);
const beamWarningColor = new THREE.Color(0xFFFF00);
const beamDangerColor = new THREE.Color(0xFF0000);
const lineWidth = 0.5;

type SensorRayProps = {
  from: NumVec3,
  to: NumVec3,
  angleX: number,
  obstacles?: THREE.Object3D[],
  visible?: boolean,
};

const SensorRay = forwardRef<Line2 | undefined, SensorRayProps>((props, beamRef) => {
  const {
    from,
    to,
    angleX,
    obstacles = [],
    visible = false,
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

    const intersection: Intersection[] = raycaster.intersectObjects(obstacles, true);
    const distance = intersection.length ? intersection[0].distance : undefined;

    if (distance === undefined) {
      lineRef.current.material.color = beamColor;
    } else if (distance > (SENSOR_DISTANCE - SENSOR_DISTANCE / 4)) {
      lineRef.current.material.color = beamWarningColor;
    } else {
      lineRef.current.material.color = beamDangerColor;
    }

    // if (distance === undefined) {
    //   lineRef.current.scale = new THREE.Vector3(1, 1, 1);
    // } else {
    //   // [0, SENSOR_HEIGHT, SENSOR_DISTANCE]
    // }
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
          visible={visible}
        />
      </line>
    </group>
  )
});

export default SensorRay;
