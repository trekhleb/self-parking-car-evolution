import React, { forwardRef } from 'react';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';

import { NumVec3 } from '../../../types/vectors';

type SensorRayProps = {
  from: NumVec3,
  to: NumVec3,
  beamColor?: THREE.Color,
  beamHitColor?: THREE.Color,
  lineWidth?: number,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
};

const SensorRay = forwardRef<Line2 | undefined, SensorRayProps>((props, beamRef) => {
  const {
    from,
    to,
    beamColor = new THREE.Color(0x009900),
    beamHitColor = new THREE.Color(0xFF0000),
    lineWidth = 0.5,
    collisionFilterGroup = -1,
    collisionFilterMask = -1,
  } = props;

  useFrame((state: RootState, delta: number) => {
    // @ts-ignore
    if (!beamRef?.current) {
      return;
    }
    // beamRef.current.getWorldQuaternion(sensorRef1.current.quaternion);
    const position = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // @ts-ignore
    beamRef.current.getWorldPosition(position);
    // @ts-ignore
    beamRef.current.getWorldDirection(direction);
  });

  // const onRay = (event: any) => {
  //   console.log({dist: event.distance, hasHit: event.hasHit});
  //   // @ts-ignore
  //   if (beamRef.current) {
  //     // @ts-ignore
  //     beamRef.current.material.color = event.hasHit ? beamHitColor : beamColor;
  //   }
  // };
  //
  // useRaycastClosest({
  //   from,
  //   to,
  //   collisionFilterGroup,
  //   collisionFilterMask,
  // }, (event) => onRay(event));

  return (
    <Line
      points={[from, to]}
      lineWidth={lineWidth}
      color={`#${beamColor.getHexString()}`}
      // @ts-ignore
      ref={beamRef}
    />
  )
});

export default SensorRay;
