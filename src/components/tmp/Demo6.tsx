import React, { useEffect, useRef } from 'react';
import M from 'matter-js';

function Car(xx: number, yy: number, width: number, height: number, wheelSize: number) {
  const group = M.Body.nextGroup(true);

  const wheelBase = 20;
  const wheelAOffset = -width * 0.5 + wheelBase;
  const wheelBOffset = width * 0.5 - wheelBase;
  const wheelYOffset = 0;

  const car = M.Composite.create({ label: 'Car' });

  const body = M.Bodies.rectangle(xx, yy, width, height, {
    collisionFilter: {
      group: group
    },
    chamfer: {
      radius: height * 0.5,
    },
    density: 0.0002
  });

  const wheelA = M.Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
    collisionFilter: {
      group: group
    },
    friction: 0.8
  });

  const wheelB = M.Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
    collisionFilter: {
      group: group
    },
    friction: 0.8
  });

  const axelA = M.Constraint.create({
    bodyB: body,
    pointB: { x: wheelAOffset, y: wheelYOffset },
    bodyA: wheelA,
    stiffness: 1,
    length: 0
  });

  const axelB = M.Constraint.create({
    bodyB: body,
    pointB: { x: wheelBOffset, y: wheelYOffset },
    bodyA: wheelB,
    stiffness: 1,
    length: 0
  });

  M.Composite.add(car, body);
  M.Composite.add(car, wheelA);
  M.Composite.add(car, wheelB);
  M.Composite.add(car, axelA);
  M.Composite.add(car, axelB);

  return car;
}

function Demo() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    const engine = M.Engine.create();

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
        showAngleIndicator: true,
        showStats: true,
        showPerformance: true,
        showBroadphase: true,
        showCollisions: true,
      }
    });

    const stack = M.Composites.stack(300, 0, 5, 2, 0, 0, function(x: number, y: number) {
      return M.Bodies.circle(x, y, M.Common.random(10, 20), {
        friction: 0.01,
        restitution: 0.5,
        density: 0.001,
      });
    });

    const boxA = M.Bodies.rectangle(200, 150, 40, 50, {
      // frictionAir: 0.001,
      angle: Math.PI * 0.16,
      render: {
        fillStyle: '#ff0000',
      },
    });

    const boxB = M.Bodies.rectangle(220, 50, 40, 50,{
      // frictionAir: 0.001,
    });

    const boxC = M.Bodies.rectangle(420, 50, 40, 50,{
      // frictionAir: 0.001,
    });

    const ground = M.Bodies.rectangle(400, 400, 500, 20, {
      isStatic: true,
      angle: -Math.PI * 0.03,
    });

    M.Composite.add(engine.world, boxA);
    M.Composite.add(engine.world, boxB);
    M.Composite.add(engine.world, boxC);
    M.Composite.add(engine.world, stack);
    const groundComposite = M.Composite.add(engine.world, ground);

    const scale = 0.8;
    M.Composite.add(engine.world, Car(550, 0, 150 * scale, 30 * scale, 30 * scale));

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

    M.Events.on(engine, 'afterUpdate', function(event) {
      const time = engine.timing.timestamp;
      M.Composite.rotate(groundComposite, Math.sin(time * 0.001) * 0.002, {
        x: 650,
        y: 400
      });
    });

    M.Events.on(engine, 'beforeUpdate', function(event) {
      const py = 100 + 100 * Math.sin(engine.timing.timestamp * 0.002);
      // M.Body.setVelocity(boxC, { x: 400, y: py - boxB.position.y });
      M.Body.setPosition(boxC, { x: 400, y: py });
    });

    // M.Render.lookAt(render, M.Composite.allBodies(engine.world));

    const runner = M.Runner.create();
    M.Runner.run(runner, engine);
  }, []);

  return (
    <div ref={divRef} />
  );
}

export default Demo;
