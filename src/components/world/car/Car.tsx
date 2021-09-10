import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { BoxProps, CylinderProps, useRaycastVehicle } from '@react-three/cannon';
import * as THREE from 'three';
import { DebouncedFunc } from 'lodash';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import throttle from 'lodash/throttle';

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
  CarMetaData,
  CarType,
  RaycastVehiclePublicApi,
  SensorValuesType,
  userCarUUID,
  WheelInfoOptions,
} from '../types/car';
import { ON_MOVE_THROTTLE_TIMEOUT, ON_UPDATE_LABEL_THROTTLE_TIMEOUT } from '../constants/performance';
import { formatLossValue } from '../../evolution/utils/evolution';
import { RectanglePoints, ThreeRectanglePoints } from '../../../types/vectors';
import { carLoss as getCarLoss } from '../../../libs/carGenetic';
import { LOSS_VALUE_BAD_THRESHOLD, LOSS_VALUE_GOOD_THRESHOLD } from '../../evolution/constants/evolution';
import { PARKING_SPOT_POINTS } from '../constants/parking';

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
  onMove?: (wheelsPositions: RectanglePoints) => void,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  onCarReady?: (args: OnCarReadyArgs) => void,
  onCarDestroy?: () => void,
  car?: CarType,
  performanceBoost?: boolean,
}

const flWheelIndex = 0;
const frWheelIndex = 1;
const blWheelIndex = 2;
const brWheelIndex = 3;

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
    onMove = () => {},
    car = { licencePlate: '', generationIndex: 0, genomeIndex: 0 },
    performanceBoost = false,
  } = props;

  const chassis = useRef<THREE.Object3D | undefined>();
  const apiRef = useRef<RaycastVehiclePublicApi | undefined>();
  const wheelsRef = useRef<MutableRefObject<THREE.Object3D | undefined>[]>([]);
  const wheelsPositionRef = useRef<ThreeRectanglePoints>({
    fl: new THREE.Vector3(),
    fr: new THREE.Vector3(),
    bl: new THREE.Vector3(),
    br: new THREE.Vector3(),
  });
  const [carLoss, setCarLoss] = useState<number | null>(null);
  const onUpdateLabelThrottledRef = useRef<DebouncedFunc<(...args: any[]) => any> | null>(null);
  const onMoveThrottledRef = useRef<DebouncedFunc<(...args: any[]) => any> | null>(null);

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
  const flWheel = useRef<THREE.Object3D | undefined>();
  const flWheelInfo = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT,
    ],
  };

  // FrontRight [X, Y, Z].
  const frWheel = useRef<THREE.Object3D | undefined>();
  const frWheelInfo = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT
    ],
  };

  // BackLeft [-X, Y, -Z].
  const blWheel = useRef<THREE.Object3D | undefined>();
  const blWheelInfo = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  // BackRight [X, Y, -Z].
  const brWheel = useRef<THREE.Object3D | undefined>();
  const brWheelInfo = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  wheels[flWheelIndex] = flWheel;
  wheels[frWheelIndex] = frWheel;
  wheels[blWheelIndex] = blWheel;
  wheels[brWheelIndex] = brWheel;

  wheelInfos[flWheelIndex] = flWheelInfo;
  wheelInfos[frWheelIndex] = frWheelInfo;
  wheelInfos[blWheelIndex] = blWheelInfo;
  wheelInfos[brWheelIndex] = brWheelInfo;

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

  const onUnmount = () => {
    if (onUpdateLabelThrottledRef.current) {
      onUpdateLabelThrottledRef.current.cancel();
    }
    if (onMoveThrottledRef.current) {
      onMoveThrottledRef.current.cancel();
    }
    onCarDestroy();
  };

  useEffect(() => {
    if (!apiRef.current || !chassis.current) {
      return onUnmount;
    }
    onCarReady({
      api: apiRef.current,
      chassis: chassis.current,
      wheelsNum: wheelsRef.current.length,
    });
    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!onMoveThrottledRef.current) {
    onMoveThrottledRef.current = throttle(onMove, ON_MOVE_THROTTLE_TIMEOUT, {
      leading: true,
      trailing: true,
    });
  }

  // @TODO: Move the logic of label content population to the evolution components.
  // Car shouldn't know about the evolution loss function.
  const onUpdateLabel = (wheelsPositions: RectanglePoints) => {
    const loss = getCarLoss({
      wheelsPosition: wheelsPositions,
      parkingLotCorners: PARKING_SPOT_POINTS,
    });
    setCarLoss(loss);
  };

  if (!onUpdateLabelThrottledRef.current) {
    onUpdateLabelThrottledRef.current = throttle(onUpdateLabel, ON_UPDATE_LABEL_THROTTLE_TIMEOUT, {
      leading: false,
      trailing: true,
    });
  }

  useFrame((state: RootState, delta: number) => {
    if (!wheels || wheels.length !== 4) {
      return;
    }
    if (
      !wheels[flWheelIndex].current ||
      !wheels[frWheelIndex].current ||
      !wheels[blWheelIndex].current ||
      !wheels[brWheelIndex].current
    ) {
      return;
    }

    // @ts-ignore
    wheels[flWheelIndex].current.getWorldPosition(wheelsPositionRef.current.fr);
    // @ts-ignore
    wheels[frWheelIndex].current.getWorldPosition(wheelsPositionRef.current.fl);
    // @ts-ignore
    wheels[blWheelIndex].current.getWorldPosition(wheelsPositionRef.current.br);
    // @ts-ignore
    wheels[brWheelIndex].current.getWorldPosition(wheelsPositionRef.current.bl);

    const {fl, fr, bl, br} = wheelsPositionRef.current;
    const wheelPositions: RectanglePoints = {
      fl: fl.toArray(),
      fr: fr.toArray(),
      bl: bl.toArray(),
      br: br.toArray(),
    };
    if (onMoveThrottledRef.current) {
      onMoveThrottledRef.current(wheelPositions);
    }

    // @TODO: Move the logic of label content population to the evolution components.
    // Car shouldn't know about the evolution loss function.
    if (withLabel && onUpdateLabelThrottledRef.current) {
      onUpdateLabelThrottledRef.current(wheelPositions);
    }
  });

  let distanceColor = 'black';
  if (carLoss !== null) {
    if (carLoss <= LOSS_VALUE_GOOD_THRESHOLD) {
      distanceColor = 'limegreen';
    } else if (carLoss <= LOSS_VALUE_BAD_THRESHOLD) {
      distanceColor = 'orange';
    } else {
      distanceColor = 'red';
    }
  }
  const label = withLabel ? (
    <span>
      Loss:
      {' '}
      <span style={{color: distanceColor, fontWeight: 'bold'}}>
        {formatLossValue(carLoss)}
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
        performanceBoost={performanceBoost}
      />
      <Wheel
        ref={flWheel}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        performanceBoost={performanceBoost}
        isLeft
      />
      <Wheel
        ref={frWheel}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        performanceBoost={performanceBoost}
      />
      <Wheel
        ref={blWheel}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        performanceBoost={performanceBoost}
        isLeft
      />
      <Wheel
        ref={brWheel}
        radius={wheelRadius}
        bodyProps={wheelBodyProps}
        styled={styled}
        wireframe={wireframe}
        baseColor={baseColor}
        performanceBoost={performanceBoost}
      />
    </group>
  )
}

export default Car;
