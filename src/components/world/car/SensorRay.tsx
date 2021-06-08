import React, { forwardRef, useEffect, useRef } from 'react';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import throttle from 'lodash/throttle';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import { Intersection } from 'three/src/core/Raycaster';
import { acceleratedRaycast } from 'three-mesh-bvh';

import { NumVec3 } from '../types/vectors';
import { SENSOR_DISTANCE } from './constants';

const beamColor = new THREE.Color(0x009900);
const beamWarningColor = new THREE.Color(0xFFFF00);
const beamDangerColor = new THREE.Color(0xFF0000);
const lineWidth = 0.5;

const intersectThrottleTimeout = 100;

THREE.Mesh.prototype.raycast = acceleratedRaycast;

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

  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const directionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  const intersectionRef = useRef<Intersection[]>([]);
  raycasterRef.current.near = 0;
  raycasterRef.current.far = SENSOR_DISTANCE;

  // @ts-ignore
  raycasterRef.current.firstHitOnly = true;

  const intersectObjects = () => {
    intersectionRef.current = raycasterRef.current.intersectObjects(obstacles, true);
  };

  const intersectObjectsThrottled = throttle(intersectObjects, intersectThrottleTimeout, {
    leading: true,
    trailing: true,
  });

  useFrame((state: RootState, delta: number) => {
    if (!lineRef?.current) {
      return;
    }

    lineRef.current.getWorldPosition(positionRef.current);
    lineRef.current.getWorldDirection(directionRef.current);

    raycasterRef.current.set(positionRef.current, directionRef.current);

    intersectObjectsThrottled();

    const distance = intersectionRef.current.length
      ? intersectionRef.current[0].distance
      : undefined;

    if (distance === undefined) {
      lineRef.current.material.color = beamColor;
    } else if (distance > (SENSOR_DISTANCE - SENSOR_DISTANCE / 4)) {
      lineRef.current.material.color = beamWarningColor;
    } else {
      lineRef.current.material.color = beamDangerColor;
    }
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
