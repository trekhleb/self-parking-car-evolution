import React, { forwardRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Canvas, GroupProps, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import {
  useCylinder,
  CylinderProps,
  Physics,
  usePlane,
  PlaneProps,
  BoxProps,
  useBox,
  useRaycastVehicle,
} from '@react-three/cannon';
import * as THREE from 'three';

const defaultContactMaterial = {
  contactEquationRelaxation: 4,
  friction: 1e-3,
}

type WheelInfoOptions = {
  radius?: number
  directionLocal?: number[]
  suspensionStiffness?: number
  suspensionRestLength?: number
  maxSuspensionForce?: number
  maxSuspensionTravel?: number
  dampingRelaxation?: number
  dampingCompression?: number
  frictionSlip?: number
  rollInfluence?: number
  axleLocal?: number[]
  chassisConnectionPointLocal?: number[]
  isFrontWheel?: boolean
  useCustomSlidingRotationalSpeed?: boolean
  customSlidingRotationalSpeed?: number
};

function Plane(props: PlaneProps) {
  const [ref] = usePlane(() => ({
    type: 'Static',
    // material: 'ground',
    ...props,
  }))
  return (
    <group ref={ref}>
      <mesh>
        <planeBufferGeometry args={[150, 150]} />
        <meshBasicMaterial color="#ffb385" />
      </mesh>
      <mesh receiveShadow>
        <planeBufferGeometry args={[150, 150]} />
        <shadowMaterial color="lightsalmon" />
      </mesh>
    </group>
  )
}

function Beetle(props: GroupProps) {
  const { nodes, materials } = useGLTF('/beetle.glb')

  // @ts-ignore
  const g1 = nodes.chassis_1.geometry;
  // @ts-ignore
  const g2 = nodes.chassis_2.geometry;
  // @ts-ignore
  const g3 = nodes.chassis_3.geometry;
  // @ts-ignore
  const g4 = nodes.chassis_4.geometry;
  // @ts-ignore
  const g5 = nodes.chassis_5.geometry;
  // @ts-ignore
  const g6 = nodes.chassis_6.geometry;
  // @ts-ignore
  const g7 = nodes.chassis_7.geometry;
  // @ts-ignore
  const g8 = nodes.chassis_8.geometry;
  // @ts-ignore
  const g9 = nodes.chassis_9.geometry;
  // @ts-ignore
  const g10 = nodes.chassis_10.geometry;
  // @ts-ignore
  const g11 = nodes.chassis_11.geometry;
  // @ts-ignore
  const g12 = nodes.chassis_12.geometry;
  // @ts-ignore
  const g13 = nodes.chassis_12.geometry;
  // @ts-ignore
  const g14 = nodes.chassis_14.geometry;
  // @ts-ignore
  const g15 = nodes.chassis_15.geometry;
  // @ts-ignore
  const g16 = nodes.chassis_16.geometry;

  return (
    <group {...props} dispose={null}>
      <mesh castShadow material={materials['Black paint']} geometry={g1} />
      <mesh castShadow material={materials.Rubber} geometry={g2} />
      <mesh castShadow material={materials.Paint} geometry={g3} />
      <mesh castShadow material={materials.Underbody} geometry={g4} />
      <mesh castShadow material={materials.Chrom} geometry={g5} />
      <mesh castShadow material={materials['Interior (dark)']} geometry={g6} />
      <mesh castShadow material={materials['Interior (light)']} geometry={g7} />
      <mesh castShadow material={materials.Reflector} geometry={g8} />
      <mesh material={materials.Glass} geometry={g9} />
      <mesh castShadow material={materials.Steel} geometry={g10} />
      <mesh castShadow material={materials['Black plastic']} geometry={g11} />
      <mesh material={materials.Headlight} geometry={g12} />
      <mesh castShadow material={materials['Reverse lights']} geometry={g13} />
      <mesh castShadow material={materials['Orange plastic']} geometry={g14} />
      <mesh castShadow material={materials['Tail lights']} geometry={g15} />
      <mesh castShadow material={materials['License Plate']} geometry={g16} />
    </group>
  )
}

useGLTF.preload('/beetle.glb')

const onCollide = (e: any) => {
  // the other body:
  console.log('bonk!', e.body.userData)
}

interface ChassisProps extends BoxProps {
  weight?: number,
}

// The vehicle chassis
const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const boxSize = [1.7, 1, 4] // roughly the cars' visual dimensions
  const [, api] = useBox(
    () => ({
      mass: props.weight || 500,
      rotation: props.rotation,
      angularVelocity: props.angularVelocity,
      allowSleep: false,
      args: boxSize,
      onCollide: onCollide,
      userData: {
        // define you custom application reference here
        id: 'vehicle-chassis',
      },
      ...props,
    }),
    // @ts-ignore
    ref
  )

  return (
    // <mesh ref={ref} api={api}>
    <mesh ref={ref}>
      <Beetle position={[0, -0.6, 0]} />
    </mesh>
  )
})

function WheelModel(props: GroupProps) {
  const { nodes, materials } = useGLTF('/wheel.glb')
  // Might be nodes.wheel_primitive0.geometry, nodes.wheel_primitive1.geometry, nodes.wheel_primitive1.geometry
  // @ts-ignore
  const g1 = nodes.wheel_1.geometry;
  // @ts-ignore
  const g2 = nodes.wheel_2.geometry;
  // @ts-ignore
  const g3 = nodes.wheel_3.geometry;
  return (
    <group {...props} dispose={null}>
      <mesh material={materials.Rubber} geometry={g1} />
      <mesh material={materials.Steel} geometry={g2} />
      <mesh material={materials.Chrom} geometry={g3} />
    </group>
  )
}

useGLTF.preload('/wheel.glb')

interface WheelProps extends CylinderProps {
  radius?: number,
  leftSide?: boolean,
}

// A Wheel
const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const size = props.radius || 0.7
  const wheelSize = [size, size, 0.5, 16]
  const isLeftSide = props.leftSide || false // mirrors geometry

  useCylinder(
    () => ({
      mass: 1,
      type: 'Kinematic',
      // material: 'wheel',
      collisionFilterGroup: 0, // turn off collisions, or turn them on if you want to fly!
      // the rotation should be applied to the shape (not the body)
      args: wheelSize,
      ...props,
    }),
    // @ts-ignore
    ref,
  )

  return (
    <mesh ref={ref}>
      <mesh rotation={[0, 0, ((isLeftSide ? 1 : -1) * Math.PI) / 2]} castShadow>
        <WheelModel />
      </mesh>
    </mesh>
  )
})

interface VehicleProps extends ChassisProps {
  wheelRadius?: number,
}

function Vehicle(props: VehicleProps) {
  // chassisBody
  const chassis = useRef()
  // wheels
  const wheels: MutableRefObject<THREE.Object3D | undefined>[] = []
  const wheelInfos: WheelInfoOptions[] = []

  // chassis - wheel connection helpers
  const chassisWidth = 1.2
  const chassisHeight = -0.04 // ground clearance
  const chassisFront = 1.3
  const chassisBack = -1.15

  const wheelInfo = {
    radius: props.wheelRadius || 0.7,
    directionLocal: [0, -1, 0], // same as Physics gravity
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    frictionSlip: 5,
    rollInfluence: 0.01,
    axleLocal: [-1, 0, 0], // wheel rotates around X-axis, invert if wheels rotate the wrong way
    chassisConnectionPointLocal: [1, 0, 1],
    isFrontWheel: false,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
  }

  // FrontLeft [-X,Y,Z]
  const wheel_1 = useRef()
  const wheelInfo_1 = { ...wheelInfo }
  wheelInfo_1.chassisConnectionPointLocal = [-chassisWidth / 2, chassisHeight, chassisFront]
  wheelInfo_1.isFrontWheel = true

  // FrontRight [X,Y,Z]
  const wheel_2 = useRef()
  const wheelInfo_2 = { ...wheelInfo }
  wheelInfo_2.chassisConnectionPointLocal = [chassisWidth / 2, chassisHeight, chassisFront]
  wheelInfo_2.isFrontWheel = true

  // BackLeft [-X,Y,-Z]
  const wheel_3 = useRef()
  const wheelInfo_3 = { ...wheelInfo }
  wheelInfo_3.isFrontWheel = false
  wheelInfo_3.chassisConnectionPointLocal = [-chassisWidth / 2, chassisHeight, chassisBack]

  // BackRight [X,Y,-Z]
  const wheel_4 = useRef()
  const wheelInfo_4 = { ...wheelInfo }
  wheelInfo_4.chassisConnectionPointLocal = [chassisWidth / 2, chassisHeight, chassisBack]
  wheelInfo_4.isFrontWheel = false

  wheels.push(wheel_1, wheel_2, wheel_3, wheel_4)
  wheelInfos.push(wheelInfo_1, wheelInfo_2, wheelInfo_3, wheelInfo_4)

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }))

  const forward = useKeyPress('w')
  const backward = useKeyPress('s')
  const left = useKeyPress('a')
  const right = useKeyPress('d')
  const brake = useKeyPress(' ') // space bar
  const reset = useKeyPress('r')

  const [steeringValue, setSteeringValue] = useState(0)
  const [engineForce, setEngineForce] = useState(0)
  const [brakeForce, setBrakeForce] = useState(0)

  const maxSteerVal = 0.5
  const maxForce = 1e3
  const maxBrakeForce = 1e5

  useFrame(() => {
    if (left && !right) {
      setSteeringValue(maxSteerVal)
    } else if (right && !left) {
      setSteeringValue(-maxSteerVal)
    } else {
      setSteeringValue(0)
    }
    if (forward && !backward) {
      setBrakeForce(0)
      setEngineForce(-maxForce)
    } else if (backward && !forward) {
      setBrakeForce(0)
      setEngineForce(maxForce)
    } else if (engineForce !== 0) {
      setEngineForce(0)
    }
    if (brake) {
      setBrakeForce(maxBrakeForce)
    }
    if (!brake) setBrakeForce(0)
    if (reset) {
      // @ts-ignore
      chassis.current.api.position.set(0, 5, 0)
      // @ts-ignore
      chassis.current.api.velocity.set(0, 0, 0)
      // @ts-ignore
      chassis.current.api.angularVelocity.set(0, 0.5, 0)
      // @ts-ignore
      chassis.current.api.rotation.set(0, -Math.PI / 4, 0)
    }
  })

  useEffect(() => {
    api.applyEngineForce(engineForce, 2)
    api.applyEngineForce(engineForce, 3)
  }, [engineForce])

  useEffect(() => {
    api.setSteeringValue(steeringValue, 0)
    api.setSteeringValue(steeringValue, 1)
  }, [steeringValue])

  useEffect(() => {
    wheels.forEach((_, i) => api.setBrake(brakeForce, i))
  }, [brakeForce])

  return (
    <group ref={vehicle}>
      <Chassis
        ref={chassis}
        rotation={props.rotation}
        position={props.position}
        angularVelocity={props.angularVelocity}
      />
      <Wheel ref={wheel_1} radius={props.wheelRadius || 0.7} leftSide />
      <Wheel ref={wheel_2} radius={props.wheelRadius || 0.7} />
      <Wheel ref={wheel_3} radius={props.wheelRadius || 0.7} leftSide />
      <Wheel ref={wheel_4} radius={props.wheelRadius || 0.7} />
    </group>
  )
}

function useKeyPress(target: string) {
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  const downHandler = ({ key }: { key: string }) => (key === target ? setKeyPressed(true) : null)
  const upHandler = ({ key }: { key: string }) => (key === target ? setKeyPressed(false) : null)

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

function Pillar(props: CylinderProps) {
  const args: [number, number, number, number] = [0.7, 0.7, 5, 16]
  const [ref] = useCylinder(() => ({
    mass: 10,
    args,
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow>
      <cylinderBufferGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ height: `550px` }}>
      <Canvas shadows camera={{ position: [0, 5, 20], fov: 50 }}>
        <OrbitControls />
        <color attach="background" args={['#171720']} />
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.3} intensity={1} castShadow penumbra={0.5} />
        <Physics broadphase="SAP" {...defaultContactMaterial} allowSleep>
          <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
          <Vehicle
            position={[0, 5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
            angularVelocity={[0, 0.5, 0]} // to get you rolling
            wheelRadius={0.3}
          />
          <Pillar position={[-5, 2.5, -5]} userData={{ id: 'pillar-1' }} />
          <Pillar position={[0, 2.5, -5]} userData={{ id: 'pillar-2' }} />
          <Pillar position={[5, 2.5, -5]} userData={{ id: 'pillar-3' }} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default Demo;
