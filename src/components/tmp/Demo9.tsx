import React from 'react';
import { Canvas, RootState, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useBox, useCylinder, usePlane, useRaycastVehicle, CylinderProps } from '@react-three/cannon';
import * as THREE from 'three';

const wireframe = false;

// @see: https://github.com/schteppe/cannon.js/blob/master/demos/raycastVehicle.html
function Car() {
  const carPosition: [number, number, number] = [0, 2, 0];
  const wheelRadius = 0.5;
  const chassisColor = 0xFF00FF;
  const wheelsColor = 0x0000FF;

  const chassisArgs: [number, number, number] = [6 * wheelRadius, wheelRadius, 2 * wheelRadius];
  const [chassisBody] = useBox(() => ({
    mass: 150,
    args: chassisArgs,
    position: carPosition,
    angularVelocity: [0, 0.5, 0],
  }))

  const wheelOptions = {
    radius: wheelRadius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 1.4,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: [0, 0, 1],
    chassisConnectionPointLocal: [-1, 0, 1],
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfos = [
    {
      ...wheelOptions,
      chassisConnectionPointLocal: [-1, 0, 1],
    },
    {
      ...wheelOptions,
      chassisConnectionPointLocal: [-1, 0, -1],
    },
    {
      ...wheelOptions,
      chassisConnectionPointLocal: [1, 0, 1],
    },
    {
      ...wheelOptions,
      chassisConnectionPointLocal: [1, 0, -1],
    },
  ];

  const wheelBodyArgs: [number, number, number, number] = [wheelRadius, wheelRadius, wheelRadius / 2, 20];
  const wheelRotation: [number, number, number] = [-Math.PI / 2, 0, 0];
  const wheelProps: CylinderProps = {
    args: wheelBodyArgs,
    mass: 0,
    type: 'Kinematic',
    collisionFilterGroup: 0,
    rotation: wheelRotation,
  };

  const [wheelBodyA] = useCylinder(() => ({ ...wheelProps }));
  const [wheelBodyB] = useCylinder(() => ({ ...wheelProps }));
  const [wheelBodyC] = useCylinder(() => ({ ...wheelProps }));
  const [wheelBodyD] = useCylinder(() => ({ ...wheelProps }));

  const wheels = [wheelBodyA, wheelBodyB, wheelBodyC, wheelBodyD];

  const [vehicleBody, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheelInfos,
    wheels,
  }))

  useFrame((state: RootState) => {
    if (!vehicleBody.current) {
      return;
    }
    // vehicleBody.current.rotation.y += 0.01;
  })

  // document.addEventListener('keydown', (event) => {
  //   if (!vehicleBody.current) {
  //     return;
  //   }
  //
  //   const maxSteerVal = 0.5
  //   const maxForce = 1000
  //   const brakeForce = 1000000
  //
  //   switch (event.key) {
  //     case 'w':
  //     case 'ArrowUp':
  //       vehicleBody.current.applyEngineForce(-maxForce, 2)
  //       vehicleBody.current.applyEngineForce(-maxForce, 3)
  //       break;
  //
  //     case 's':
  //     case 'ArrowDown':
  //       vehicleBody.current.applyEngineForce(maxForce, 2)
  //       vehicleBody.current.applyEngineForce(maxForce, 3)
  //       break;
  //
  //     case 'a':
  //     case 'ArrowLeft':
  //       vehicleBody.current.setSteeringValue(maxSteerVal, 0)
  //       vehicleBody.current.setSteeringValue(maxSteerVal, 1)
  //       break;
  //
  //     case 'd':
  //     case 'ArrowRight':
  //       vehicleBody.current.setSteeringValue(-maxSteerVal, 0)
  //       vehicleBody.current.setSteeringValue(-maxSteerVal, 1)
  //       break;
  //
  //     case 'b':
  //       vehicleBody.current.setBrake(brakeForce, 0)
  //       vehicleBody.current.setBrake(brakeForce, 1)
  //       vehicleBody.current.setBrake(brakeForce, 2)
  //       vehicleBody.current.setBrake(brakeForce, 3)
  //       break;
  //   }
  // })
  //
  // // Reset force on keyup
  // document.addEventListener('keyup', (event) => {
  //   switch (event.key) {
  //     case 'w':
  //     case 'ArrowUp':
  //       vehicleBody.current.applyEngineForce(0, 2)
  //       vehicleBody.current.applyEngineForce(0, 3)
  //       break;
  //
  //     case 's':
  //     case 'ArrowDown':
  //       vehicleBody.current.applyEngineForce(0, 2)
  //       vehicleBody.current.applyEngineForce(0, 3)
  //       break;
  //
  //     case 'a':
  //     case 'ArrowLeft':
  //       vehicleBody.current.setSteeringValue(0, 0)
  //       vehicleBody.current.setSteeringValue(0, 1)
  //       break;
  //
  //     case 'd':
  //     case 'ArrowRight':
  //       vehicleBody.current.setSteeringValue(0, 0)
  //       vehicleBody.current.setSteeringValue(0, 1)
  //       break;
  //
  //     case 'b':
  //       vehicleBody.current.setBrake(0, 0)
  //       vehicleBody.current.setBrake(0, 1)
  //       vehicleBody.current.setBrake(0, 2)
  //       vehicleBody.current.setBrake(0, 3)
  //       break;
  //   }
  // });

  return (
    <mesh ref={vehicleBody} receiveShadow castShadow position={carPosition}>
      <mesh ref={chassisBody} receiveShadow castShadow>
        <boxBufferGeometry attach="geometry" args={chassisArgs} />
        <meshPhysicalMaterial attach="material" color={chassisColor} wireframe={wireframe} />
      </mesh>
      <mesh ref={wheelBodyA} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={wheelBodyArgs} />
        <meshPhysicalMaterial attach="material" color={wheelsColor} wireframe={wireframe} />
      </mesh>
      <mesh ref={wheelBodyB} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={wheelBodyArgs} />
        <meshPhysicalMaterial attach="material" color={wheelsColor} wireframe={wireframe} />
      </mesh>
      <mesh ref={wheelBodyC} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={wheelBodyArgs} />
        <meshPhysicalMaterial attach="material" color={wheelsColor} wireframe={wireframe} />
      </mesh>
      <mesh ref={wheelBodyD} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={wheelBodyArgs} />
        <meshPhysicalMaterial attach="material" color={wheelsColor} wireframe={wireframe} />
      </mesh>
    </mesh>
  )
}

function Plane(props: any) {
  const args: [number, number] = [100, 100];
  const [ref] = usePlane(() => ({
    args,
    mass: 0,
    position: [0, -1, 0],
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={args} />
      <shadowMaterial attach="material" color="#171717" opacity={0.5} />
    </mesh>
  )
}

function Box(props: any) {
  const args: [number, number, number] = [0.1, 0.2, 0.1];
  const [ref] = useBox(() => ({
    mass: 1,
    args,
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    // sleepSpeedLimit: 10.0,
    ...props,
  }))
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    // ref.current.rotation.x = clock.getElapsedTime();
  })
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshLambertMaterial attach="material" color={0xff0000} side={THREE.DoubleSide} wireframe={wireframe} />
    </mesh>
  )
}

function Cylinder(props: any) {
  const args: [number, number, number, number] = [0.1, 0.1, 0.5, 20];
  const [ref] = useCylinder(() => ({
    mass: 1,
    args,
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    ...props,
  }))
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <cylinderBufferGeometry attach="geometry" args={args} />
      <meshLambertMaterial attach="material" color={0x00ff00} side={THREE.DoubleSide} wireframe={wireframe} />
    </mesh>
  )
}

function Demo() {
  return (
    <div style={{ height: `550px` }}>
      <Canvas
        camera={{ fov: 50, position: [-4, 4, 4] }}
        shadows
      >
        {/*<ambientLight intensity={0.3}/>*/}
        {/*<pointLight position={[-5, 10, 10]} intensity={0.5} castShadow />*/}
        {/*<directionalLight position={[10, 10, 10]} intensity={0.3} castShadow />*/}
        <color attach="background" args={['lightblue']} />
        <hemisphereLight intensity={0.35} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          castShadow
        />
        <Physics
          gravity={[0, -10, 0]}
          iterations={30}
          broadphase="SAP"
          defaultContactMaterial={{
            friction: 0.01,
            restitution: 0,
          }}
        >
          <Plane />
          <Box />
          <Box />
          <Box />
          <Cylinder />
          <Car />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Demo;
