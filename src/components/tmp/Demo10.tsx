import React, { useEffect, useRef } from 'react';
import * as CANNON from 'cannon-es';
import {
  MeshLambertMaterial,
  SphereGeometry,
  PlaneGeometry,
  BoxGeometry,
  CylinderGeometry,
  Vector3,
  Material,
  Group,
  Quaternion,
  Mesh,
  Scene,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  AmbientLight,
  SpotLight,
  DirectionalLight,
} from 'three';
import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const materialColor = 0xdddddd;
const solidMaterial = new MeshLambertMaterial({ color: materialColor });
const particleMaterial = new MeshLambertMaterial({ color: 0xff0000 });
const currentMaterial = solidMaterial;

let lastCallTime = 0;
let resetCallTime = false;

const settings = {
  stepFrequency: 60,
  quatNormalizeSkip: 2,
  quatNormalizeFast: true,
  gx: 0,
  gy: 0,
  gz: 0,
  iterations: 3,
  tolerance: 0.0001,
  k: 1e6,
  d: 3,
  scene: 0,
  paused: false,
  rendermode: 'solid',
  constraints: false,
  contacts: false, // Contact points
  cm2contact: false, // center of mass to contact points
  normals: false, // contact normals
  axes: false, // "local" frame axes
  shadows: false,
  aabbs: false,
  profiling: false,
  maxSubSteps: 20,
};

function updatePhysics(world: CANNON.World) {
  console.log('+++ updatePhysics');

  // Step world
  const timeStep = 1 / settings.stepFrequency

  const now = performance.now() / 1000

  if (!lastCallTime) {
    // last call time not saved, cant guess elapsed time. Take a simple step.
    world.step(timeStep)
    lastCallTime = now
    return
  }

  let timeSinceLastCall = now - lastCallTime
  if (resetCallTime) {
    timeSinceLastCall = 0
    resetCallTime = false
  }

  world.step(timeStep, timeSinceLastCall, settings.maxSubSteps)

  lastCallTime = now
}

function shapeToGeometry(
  shape: CANNON.Shape | CANNON.Sphere, { flatShading = true } = {}
): BufferGeometry {
  switch (shape.type) {
    case CANNON.Shape.types.SPHERE: {
      // @ts-ignore
      return new SphereGeometry(shape.radius, 8, 8)
    }

    case CANNON.Shape.types.PARTICLE: {
      return new SphereGeometry(0.1, 8, 8)
    }

    case CANNON.Shape.types.PLANE: {
      return new PlaneGeometry(500, 500, 4, 4)
    }

    case CANNON.Shape.types.BOX: {
      // @ts-ignore
      return new BoxGeometry(shape.halfExtents.x * 2, shape.halfExtents.y * 2, shape.halfExtents.z * 2)
    }

    case CANNON.Shape.types.CYLINDER: {
      // @ts-ignore
      return new CylinderGeometry(shape.radiusTop, shape.radiusBottom, shape.height, shape.numSegments)
    }

    case CANNON.Shape.types.CONVEXPOLYHEDRON: {
      const geometry = new Geometry()

      // Add vertices
      // @ts-ignore
      for (let i = 0; i < shape.vertices.length; i++) {
        // @ts-ignore
        const vertex = shape.vertices[i]
        geometry.vertices.push(new Vector3(vertex.x, vertex.y, vertex.z))
      }

      // Add faces
      // @ts-ignore
      for (let i = 0; i < shape.faces.length; i++) {
        // @ts-ignore
        const face = shape.faces[i]

        const a = face[0]
        for (let j = 1; j < face.length - 1; j++) {
          const b = face[j]
          const c = face[j + 1]
          geometry.faces.push(new Face3(a, b, c))
        }
      }

      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeFaceNormals()
      } else {
        geometry.computeVertexNormals()
      }

      // @ts-ignore
      return geometry
    }

    case CANNON.Shape.types.HEIGHTFIELD: {
      const geometry = new Geometry()

      const v0 = new CANNON.Vec3()
      const v1 = new CANNON.Vec3()
      const v2 = new CANNON.Vec3()
      // @ts-ignore
      for (let xi = 0; xi < shape.data.length - 1; xi++) {
        // @ts-ignore
        for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
          for (let k = 0; k < 2; k++) {
            // @ts-ignore
            shape.getConvexTrianglePillar(xi, yi, k === 0)
            // @ts-ignore
            v0.copy(shape.pillarConvex.vertices[0])
            // @ts-ignore
            v1.copy(shape.pillarConvex.vertices[1])
            // @ts-ignore
            v2.copy(shape.pillarConvex.vertices[2])
            // @ts-ignore
            v0.vadd(shape.pillarOffset, v0)
            // @ts-ignore
            v1.vadd(shape.pillarOffset, v1)
            // @ts-ignore
            v2.vadd(shape.pillarOffset, v2)
            geometry.vertices.push(
              new Vector3(v0.x, v0.y, v0.z),
              new Vector3(v1.x, v1.y, v1.z),
              new Vector3(v2.x, v2.y, v2.z)
            )
            const i = geometry.vertices.length - 3
            geometry.faces.push(new Face3(i, i + 1, i + 2))
          }
        }
      }

      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeFaceNormals()
      } else {
        geometry.computeVertexNormals()
      }

      // @ts-ignore
      return geometry
    }

    case CANNON.Shape.types.TRIMESH: {
      const geometry = new Geometry()

      const v0 = new CANNON.Vec3()
      const v1 = new CANNON.Vec3()
      const v2 = new CANNON.Vec3()
      // @ts-ignore
      for (let i = 0; i < shape.indices.length / 3; i++) {
        // @ts-ignore
        shape.getTriangleVertices(i, v0, v1, v2)
        geometry.vertices.push(
          new Vector3(v0.x, v0.y, v0.z),
          new Vector3(v1.x, v1.y, v1.z),
          new Vector3(v2.x, v2.y, v2.z)
        )
        const j = geometry.vertices.length - 3
        geometry.faces.push(new Face3(j, j + 1, j + 2))
      }

      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeFaceNormals()
      } else {
        geometry.computeVertexNormals()
      }

      // @ts-ignore
      return geometry
    }

    default: {
      throw new Error(`Shape not recognized: "${shape.type}"`)
    }
  }
}

function bodyToMesh(body: CANNON.Body, material: Material) {
  const group = new Group()

  const position = new Vector3(body.position.x, body.position.y, body.position.z);
  const quaternion = new Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z);
  group.position.copy(position)
  group.quaternion.copy(quaternion)

  const meshes = body.shapes.map((shape) => {
    const geometry = shapeToGeometry(shape)
    return new Mesh(geometry, material)
  })

  meshes.forEach((mesh, i) => {
    const offset = body.shapeOffsets[i]
    const orientation = body.shapeOrientations[i]
    const position = new Vector3(offset.x, offset.y, offset.z)
    const quaternion = new Quaternion(orientation.x, orientation.y, orientation.z)
    mesh.position.copy(position)
    mesh.quaternion.copy(quaternion)
    group.add(mesh)
  })

  return group
}

function addVisual(body: CANNON.Body, scene: Scene) {
  const isParticle = body.shapes.every((s) => s instanceof CANNON.Particle)
  const material = isParticle ? particleMaterial : currentMaterial
  const mesh = bodyToMesh(body, material)
  mesh.traverse((child) => {
    child.castShadow = true
    child.receiveShadow = true
  })
  scene.add(mesh)
}

function addVisuals(bodies: CANNON.Body[], scene: Scene) {
  bodies.forEach((body) => {
    addVisual(body, scene)
  })
}

function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    console.log('+++ useEffect');

    // Setup world.
    console.log('+++ setup world');
    const world = new CANNON.World();
    world.gravity.set(0, -10, 0)
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.defaultContactMaterial.friction = 0

    console.log('+++ setup camera');
    const camera = new PerspectiveCamera(24, window.innerWidth / window.innerHeight, 5, 2000)
    camera.position.set(0, 20, 30)
    camera.lookAt(0, 0, 0)

    // Scene
    console.log('+++ setup scene');
    const scene = new Scene();
    scene.fog = new Fog(0x222222, 1000, 2000)

    // Renderer
    console.log('+++ setaup renderer');
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    renderer.setClearColor(scene.fog.color, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap

    // Lights
    console.log('+++ setup lights');
    const ambientLight = new AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    const spotLight = new SpotLight(0xffffff, 0.9, 0, Math.PI / 8, 1)
    spotLight.position.set(-30, 40, 30)
    spotLight.target.position.set(0, 0, 0)

    spotLight.castShadow = true

    spotLight.shadow.camera.near = 10
    spotLight.shadow.camera.far = 100
    spotLight.shadow.camera.fov = 30

    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048

    scene.add(spotLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.15)
    directionalLight.position.set(-30, 40, 30)
    directionalLight.target.position.set(0, 0, 0)
    scene.add(directionalLight)

    // Orbit controls
    console.log('+++ setup controls');
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.enableDamping = true
    controls.enablePan = false
    controls.dampingFactor = 0.2
    controls.minDistance = 10
    controls.maxDistance = 500

    function animate() {
      console.log('+++ animate');
      // requestAnimationFrame(animate)
      updatePhysics(world)
      controls.update()
      renderer.render(scene, camera)
    }

    // Build the car chassis
    console.log('+++ setup chassis');
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1))
    const chassisBody = new CANNON.Body({ mass: 150 })
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, 0)
    chassisBody.angularVelocity.set(0, 0.5, 0)
    addVisual(chassisBody, scene)

    // Create the vehicle
    console.log('+++ create vehicle');
    const vehicle = new CANNON.RaycastVehicle({
      chassisBody,
    })

    console.log('+++ add wheels');
    const wheelOptions = {
      radius: 0.5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 1.4,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(0, 0, 1),
      chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    }

    wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1, 0, 1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1, 0, -1)
    vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(world)

    // Add the wheel bodies
    console.log('+++ add wheel bodies');
    const wheelBodies: CANNON.Body[] = []
    const wheelMaterial = new CANNON.Material('wheel')
    vehicle.wheelInfos.forEach((wheel) => {
      const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
      const wheelBody = new CANNON.Body({
        mass: 0,
        material: wheelMaterial,
      })
      wheelBody.type = CANNON.Body.KINEMATIC
      wheelBody.collisionFilterGroup = 0 // turn off collisions
      const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
      wheelBodies.push(wheelBody)
      addVisual(wheelBody, scene)
      world.addBody(wheelBody)
    })

    // Update the wheel bodies
    console.log('+++ add event listeners');
    world.addEventListener('postStep', () => {
      console.log('+++ postStep');
      for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i)
        const transform = vehicle.wheelInfos[i].worldTransform
        const wheelBody = wheelBodies[i]
        wheelBody.position.copy(transform.position)
        wheelBody.quaternion.copy(transform.quaternion)
      }
      console.log('+++ postStep: Done');
    })

    // Add the ground
    const sizeX = 64
    const sizeZ = 64
    const matrix: number[][] = []
    for (let i = 0; i < sizeX; i++) {
      matrix.push([])
      for (let j = 0; j < sizeZ; j++) {
        if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeZ - 1) {
          const height = 3
          matrix[i].push(height)
          continue
        }

        const height = Math.cos((i / sizeX) * Math.PI * 5) * Math.cos((j / sizeZ) * Math.PI * 5) * 2 + 2
        matrix[i].push(height)
      }
    }

    const groundMaterial = new CANNON.Material('ground')
    const heightfieldShape = new CANNON.Heightfield(matrix, {
      elementSize: 100 / sizeX,
    })
    const heightfieldBody = new CANNON.Body({ mass: 0, material: groundMaterial })
    heightfieldBody.addShape(heightfieldShape)
    heightfieldBody.position.set(
      // -((sizeX - 1) * heightfieldShape.elementSize) / 2,
      -(sizeX * heightfieldShape.elementSize) / 2,
      -1,
      // ((sizeZ - 1) * heightfieldShape.elementSize) / 2
      (sizeZ * heightfieldShape.elementSize) / 2
    )
    heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    world.addBody(heightfieldBody)
    // addVisual(heightfieldBody, scene)

    // Define interactions between wheels and ground
    const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000,
    })
    world.addContactMaterial(wheel_ground)

    // Keybindings
    // Add force on keydown
    document.addEventListener('keydown', (event) => {
      const maxSteerVal = 0.5
      const maxForce = 1000
      const brakeForce = 1000000

      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          vehicle.applyEngineForce(-maxForce, 2)
          vehicle.applyEngineForce(-maxForce, 3)
          break

        case 's':
        case 'ArrowDown':
          vehicle.applyEngineForce(maxForce, 2)
          vehicle.applyEngineForce(maxForce, 3)
          break

        case 'a':
        case 'ArrowLeft':
          vehicle.setSteeringValue(maxSteerVal, 0)
          vehicle.setSteeringValue(maxSteerVal, 1)
          break

        case 'd':
        case 'ArrowRight':
          vehicle.setSteeringValue(-maxSteerVal, 0)
          vehicle.setSteeringValue(-maxSteerVal, 1)
          break

        case 'b':
          vehicle.setBrake(brakeForce, 0)
          vehicle.setBrake(brakeForce, 1)
          vehicle.setBrake(brakeForce, 2)
          vehicle.setBrake(brakeForce, 3)
          break
      }
    })

    // Reset force on keyup
    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          vehicle.applyEngineForce(0, 2)
          vehicle.applyEngineForce(0, 3)
          break

        case 's':
        case 'ArrowDown':
          vehicle.applyEngineForce(0, 2)
          vehicle.applyEngineForce(0, 3)
          break

        case 'a':
        case 'ArrowLeft':
          vehicle.setSteeringValue(0, 0)
          vehicle.setSteeringValue(0, 1)
          break

        case 'd':
        case 'ArrowRight':
          vehicle.setSteeringValue(0, 0)
          vehicle.setSteeringValue(0, 1)
          break

        case 'b':
          vehicle.setBrake(0, 0)
          vehicle.setBrake(0, 1)
          vehicle.setBrake(0, 2)
          vehicle.setBrake(0, 3)
          break
      }
    })

    animate()
  }, []);

  return (
    <div ref={containerRef} style={{ height: `550px` }} />
  );
}

export default Demo;
