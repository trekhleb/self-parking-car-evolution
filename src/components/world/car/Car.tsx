import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { BoxProps, CylinderProps, useRaycastVehicle } from '@react-three/cannon';
import * as THREE from 'three';

import Chassis from './Chassis';
import Wheel from './Wheel';
import {
  CHASSIS_BACK_WHEEL_SHIFT,
  CHASSIS_BASE_COLOR,
  CHASSIS_FRONT_WHEEL_SHIFT,
  CHASSIS_GROUND_CLEARANCE,
  CHASSIS_RELATIVE_POSITION,
  CHASSIS_WHEEL_WIDTH,
  SENSORS_NUM,
  WHEEL_CUSTOM_SLIDING_ROTATION_SPEED,
  WHEEL_DAMPING_COMPRESSION,
  WHEEL_DAMPING_RELAXATION,
  WHEEL_FRICTION_SLIP,
  WHEEL_MAX_SUSPENSION_FORCE,
  WHEEL_MAX_SUSPENSION_TRAVEL,
  WHEEL_RADIUS,
  WHEEL_ROLL_INFLUENCE,
  WHEEL_SUSPENSION_REST_LENGTH,
  WHEEL_SUSPENSION_STIFFNESS
} from './constants';
import {
  CarMetaData, CarType,
  RaycastVehiclePublicApi,
  SensorValuesType,
  userCarUUID,
  WheelInfoOptions,
} from '../types/car';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import throttle from 'lodash/throttle';
import { ON_MOVE_THROTTLE_TIMEOUT } from '../constants/performance';
import { PARKING_SPOT_CORNERS } from '../surroundings/ParkingSpot';
import { fitness, roundFitnessValue } from '../../evolution/utils/evolution';

export type OnCarReadyArgs = {
  api: RaycastVehiclePublicApi,
  chassis: THREE.Object3D,
  wheelsNum: number,
};

type CarProps = {
  uuid: userCarUUID,
  bodyProps: BoxProps,
  wheelRadius?: number,
  wireframe?: boolean,
  styled?: boolean,
  movable?: boolean,
  withSensors?: boolean,
  withLabel?: boolean,
  visibleSensors?: boolean,
  baseColor?: string,
  onCollide?: (carMetaData: CarMetaData, event: any) => void,
  onSensors?: (sensors: SensorValuesType) => void,
  // [front-Left, front-right, back-right, back-left]
  onMove?: (wheelsPositions: [number, number, number][]) => void,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  onCarReady?: (args: OnCarReadyArgs) => void,
  onCarDestroy?: () => void,
  car?: CarType,
}

function Car(props: CarProps) {
  const {
    uuid,
    wheelRadius = WHEEL_RADIUS,
    wireframe = false,
    withLabel = false,
    styled = true,
    withSensors = false,
    visibleSensors = false,
    movable = false,
    baseColor = CHASSIS_BASE_COLOR,
    collisionFilterGroup,
    collisionFilterMask,
    bodyProps = {},
    onCollide = () => {},
    onCarReady = () => {},
    onCarDestroy = () => {},
    onSensors = () => {},
    onMove = (wheelsPositions) => {},
    car = { licencePlate: '' },
  } = props;

  const chassis = useRef<THREE.Object3D | undefined>();
  const apiRef = useRef<RaycastVehiclePublicApi | undefined>();
  const wheelsRef = useRef<MutableRefObject<THREE.Object3D | undefined>[]>([]);
  const wheelsPositionRef = useRef<Array<THREE.Vector3>>([
    new THREE.Vector3(), // front-Left
    new THREE.Vector3(), // front-right
    new THREE.Vector3(), // back-left
    new THREE.Vector3(), // back-right
  ]);
  const [carFitness, setCarFitness] = useState<number | null>(null);

  // [front-Left, front-right, back-left, back-right]
  const wheels: MutableRefObject<THREE.Object3D | undefined>[] = [];
  const wheelInfos: WheelInfoOptions[] = [];

  const wheelInfo = {
    isFrontWheel: false,
    radius: wheelRadius,
    directionLocal: [0, -1, 0], // Same as Physics gravity.
    axleLocal: [-1, 0, 0], // wheel rotates around X-axis, invert if wheels rotate the wrong way
    chassisConnectionPointLocal: [1, 0, 1],
    suspensionStiffness: WHEEL_SUSPENSION_STIFFNESS,
    suspensionRestLength: WHEEL_SUSPENSION_REST_LENGTH,
    maxSuspensionForce: WHEEL_MAX_SUSPENSION_FORCE,
    maxSuspensionTravel: WHEEL_MAX_SUSPENSION_TRAVEL,
    dampingRelaxation: WHEEL_DAMPING_RELAXATION,
    dampingCompression: WHEEL_DAMPING_COMPRESSION,
    frictionSlip: WHEEL_FRICTION_SLIP,
    rollInfluence: WHEEL_ROLL_INFLUENCE,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: WHEEL_CUSTOM_SLIDING_ROTATION_SPEED,
  };

  // FrontLeft [-X, Y, Z].
  const wheel_fl = useRef<THREE.Object3D | undefined>();
  const wheelInfo_fl = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT,
    ],
  };

  // FrontRight [X, Y, Z].
  const wheel_fr = useRef<THREE.Object3D | undefined>();
  const wheelInfo_fr = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT
    ],
  };

  // BackLeft [-X, Y, -Z].
  const wheel_bl = useRef<THREE.Object3D | undefined>();
  const wheelInfo_bl = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  // BackRight [X, Y, -Z].
  const wheel_br = useRef<THREE.Object3D | undefined>();
  const wheelInfo_br = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  wheels.push(wheel_fl, wheel_fr, wheel_bl, wheel_br);
  wheelInfos.push(wheelInfo_fl, wheelInfo_fr, wheelInfo_bl, wheelInfo_br);

  const isSensorObstacle = !movable;

  const [vehicle, vehicleAPI] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const wheelMetaData: CarMetaData = {
    uuid: 'wheel',
    type: 'wheel',
    isSensorObstacle,
  };

  const wheelBodyProps: CylinderProps = {
    position: bodyProps.position,
    userData: wheelMetaData,
  };

  const carMetaData: CarMetaData = {
    uuid,
    type: 'chassis',
    isSensorObstacle,
  };

  apiRef.current = vehicleAPI;
  wheelsRef.current = wheels;

  useEffect(() => {
    if (!apiRef.current || !chassis.current) {
      return () => {
        onCarDestroy();
      };
    }
    onCarReady({
      api: apiRef.current,
      chassis: chassis.current,
      wheelsNum: wheelsRef.current.length,
    });
    return () => {
      onCarDestroy();
    };
  }, []);

  const onMoveThrottled = throttle(onMove, ON_MOVE_THROTTLE_TIMEOUT, {
    leading: true,
    trailing: true,
  });

  const onUpdateLabel = (wheelsPositions: [number, number, number][]) => {
    const [flWheel, frWheel, brWheel, blWheel] = wheelsPositions;
    const [flLot, frLot, brLot, blLot] = PARKING_SPOT_CORNERS;
    const carFitness = fitness({
      wheelsCoordinates: {
        fl: flWheel,
        fr: frWheel,
        br: brWheel,
        bl: blWheel,
      },
      parkingLotCoordinates: {
        fl: flLot,
        fr: frLot,
        br: brLot,
        bl: blLot,
      },
    });
    setCarFitness(roundFitnessValue(carFitness));
  };

  const onUpdateLabelThrottled = throttle(onUpdateLabel, 500, {
    leading: true,
    trailing: true,
  });

  useFrame((state: RootState, delta: number) => {
    if (!wheels || wheels.length !== 4) {
      return;
    }
    if (!wheels[0].current || !wheels[1].current || !wheels[2].current || !wheels[3].current) {
      return;
    }

    wheels[0].current.getWorldPosition(wheelsPositionRef.current[0]);
    wheels[1].current.getWorldPosition(wheelsPositionRef.current[1]);
    wheels[2].current.getWorldPosition(wheelsPositionRef.current[2]);
    wheels[3].current.getWorldPosition(wheelsPositionRef.current[3]);

    const [fl, fr, bl, br] = wheelsPositionRef.current;
    const wheelPositions: [number, number, number][] = [
      [fl.x, fl.y, fl.z],
      [fr.x, fr.y, fr.z],
      [br.x, br.y, br.z],
      [bl.x, bl.y, bl.z],
    ];
    onMoveThrottled(wheelPositions);

    if (withLabel) {
      onUpdateLabelThrottled(wheelPositions);
    }
  });

  const distanceColor = 'red';
  const label = withLabel ? (
    <span>Distance:
      <span style={{color: distanceColor}}>
        {carFitness}
      </span>
    </span>
  ) : null;

  return (
    <group ref={vehicle}>
      <Chassis
        ref={chassis}
        sensorsNum={car.sensorsNum || SENSORS_NUM}
        chassisPosition={CHASSIS_RELATIVE_POSITION}
        styled={styled}
        wireframe={wireframe}
        movable={movable}
        label={label}
        withSensors={withSensors}
        visibleSensors={visibleSensors}
        baseColor={baseColor}
        bodyProps={{ ...bodyProps }}
        onCollide={(event) => onCollide(carMetaData, event)}
        onSensors={onSensors}
        userData={carMetaData}
        collisionFilterGroup={collisionFilterGroup}
        collisionFilterMask={collisionFilterMask}
      />
      <Wheel
        ref={wheel_fl}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        isLeft
      />
      <Wheel
        ref={wheel_fr}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
      />
      <Wheel
        ref={wheel_bl}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        isLeft
      />
      <Wheel
        ref={wheel_br}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
      />
    </group>
  )
}

export default Car;
