import React, { useEffect, useRef } from 'react';
import M from 'matter-js';

function Car(x: number, y: number, isStatic = false) {
  const frictionAir = 1;
  const density = 0.002;
  const w = 80;
  const h = 35;
  const wheelScale = 0.3;

  const group = M.Body.nextGroup(true);

  const car = M.Composite.create({ label: 'Car' });

  const body = M.Bodies.rectangle(x, y, w, h, {
    density,
    frictionAir,
    collisionFilter: {
      group: group,
    },
    chamfer: {
      radius: h * 0.2,
    },
  });

  const wheelWidth = wheelScale * w;
  const wheelHeight = wheelScale * h;
  const wheelOffsetX = w * 0.5 - wheelWidth;
  const wheelOffsetY = h * 0.5;
  const wheelChamferRadius = wheelScale * h * 0.2;

  const wheelOptions = {
    density,
    frictionAir,
    collisionFilter: {
      group: group,
    },
    chamfer: {
      radius: wheelChamferRadius,
    },
  };

  const wheelFrontLeft = M.Bodies.rectangle(
    x + wheelOffsetX,
    y - wheelOffsetY,
    wheelWidth,
    wheelHeight,
    wheelOptions,
  );

  const wheelFrontRight = M.Bodies.rectangle(
    x + wheelOffsetX,
    y + wheelOffsetY,
    wheelWidth,
    wheelHeight,
    wheelOptions,
  );

  const wheelRearLeft = M.Bodies.rectangle(
    x - wheelOffsetX,
    y - wheelOffsetY,
    wheelWidth,
    wheelHeight,
    wheelOptions,
  );

  const wheelRearRight = M.Bodies.rectangle(
    x - wheelOffsetX,
    y + wheelOffsetY,
    wheelWidth,
    wheelHeight,
    wheelOptions,
  );

  const axelProps = {
    bodyB: body,
    stiffness: 1,
    length: 0
  };

  const axelFrontLeft = M.Constraint.create({
    ...axelProps,
    pointB: { x: wheelOffsetX, y: -wheelOffsetY },
    bodyA: wheelFrontLeft,
  });

  const axelFrontRight = M.Constraint.create({
    ...axelProps,
    pointB: { x: wheelOffsetX, y: wheelOffsetY },
    bodyA: wheelFrontRight,
  });

  const axelRearLeft = M.Constraint.create({
    ...axelProps,
    pointB: { x: -wheelOffsetX, y: -wheelOffsetY },
    bodyA: wheelRearLeft,
  });

  const axelRearRight = M.Constraint.create({
    ...axelProps,
    pointB: { x: -wheelOffsetX, y: wheelOffsetY },
    bodyA: wheelRearRight,
  });

  M.Body.setStatic(body, isStatic);
  M.Body.setStatic(wheelFrontLeft, isStatic);
  M.Body.setStatic(wheelFrontRight, isStatic);
  M.Body.setStatic(wheelRearLeft, isStatic);
  M.Body.setStatic(wheelRearRight, isStatic);

  M.Composite.add(car, body);

  M.Composite.add(car, wheelFrontLeft);
  M.Composite.add(car, wheelFrontRight);
  M.Composite.add(car, wheelRearLeft);
  M.Composite.add(car, wheelRearRight);

  M.Composite.add(car, axelFrontLeft);
  M.Composite.add(car, axelFrontRight);
  M.Composite.add(car, axelRearLeft);
  M.Composite.add(car, axelRearRight);

  return car;
}

function Demo() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    const engine = M.Engine.create();
    engine.world.gravity.y = 0;

    const render = M.Render.create({
      element: divRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 500,
        showSleeping: true,
        background: '#000000',
        wireframeBackground: '#000000',
        wireframes: true,
        // @ts-ignore
        showCollisions: true,
      }
    });

    const car1 = Car(200, 150);
    const car2 = Car(200, 250, true);
    const car3 = Car(300, 250, true);
    const car4 = Car(500, 250, true);
    const car5 = Car(600, 250, true);

    M.Composite.add(engine.world, car1);
    M.Composite.add(engine.world, car2);
    M.Composite.add(engine.world, car3);
    M.Composite.add(engine.world, car4);
    M.Composite.add(engine.world, car5);

    const mouse = M.Mouse.create(render.canvas);
    const mouseConstraint = M.MouseConstraint.create(engine, {
      mouse: mouse,
      // @ts-ignore
      stiffness: 0.2,
      render: {
        visible: false
      }
    });
    M.Composite.add(engine.world, mouseConstraint.constraint);

    M.Render.run(render);

    const runner = M.Runner.create();
    M.Runner.run(runner, engine);
  }, []);

  return (
    <div ref={divRef} />
  );
}

export default Demo;
