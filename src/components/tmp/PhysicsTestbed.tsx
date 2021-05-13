import React, { useEffect } from 'react';
import * as planck from 'planck-js/testbed'
import { BodyDef, FixtureDef, World } from 'planck-js/lib';
import { EdgeShape } from 'planck-js/lib/shape';
import { Testbed } from 'planck-js';
import { FixtureOpt, Vec2, WheelJoint } from 'planck-js/testbed';

function PhysicsTestbed() {
  useEffect(() => {
    planck.testbed((testbed: Testbed): World => {
      // Create the world.
      const gravity: Vec2 = planck.Vec2(0.0, -10.0);
      const world: World = planck.World({
        gravity,
      });

      // Create the ground edge.
      const groundBodyDef: BodyDef = {
        position: planck.Vec2(0.0, -10.0)
      };
      const groundBody = world.createBody(groundBodyDef);
      const heights = [ 0.0, 0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -1.25, 0.0 ];
      const startX = -20;
      let x = startX;
      let y1 = 0.0;
      const dx = 10.0;
      for (let step = 0; step < heights.length; step += 1) {
        const y2 = heights[step];
        const groundEdge: EdgeShape = planck.Edge(
          planck.Vec2(x, y1),
          planck.Vec2(x + dx, y2),
        );
        const groundBodyFixtureOpts: FixtureOpt = {
          density: 0.0,
          friction: 0.3,
        };
        groundBody.createFixture(groundEdge, groundBodyFixtureOpts);
        y1 = y2;
        x += dx;
      }

      // Create dynamic body.
      const body = world.createBody({
        type: 'dynamic',
        position: planck.Vec2(-10.0, 4.0)
      });
      const dynamicBox = planck.Box(1.0, 2.0);
      const fixtureDef: FixtureDef = {
        shape: dynamicBox,
        density: 1.0,
        friction: 0.3,
      }
      body.createFixture(fixtureDef);
      // body.setLinearVelocity(planck.Vec2(5.0, 0.0));

      // const timeStep = 1 / 60;
      // const velocityIterations = 6;
      // const positionIterations = 2;

      // Car
      const car = world.createDynamicBody(planck.Vec2(0.0, 1.0));
      car.createFixture(planck.Polygon([
        planck.Vec2(-1.5, -0.5),
        planck.Vec2(1.5, -0.5),
        planck.Vec2(1.5, 0.0),
        planck.Vec2(0.0, 0.9),
        planck.Vec2(-1.15, 0.9),
        planck.Vec2(-1.5, 0.2)
      ]), 1.0);

      const wheelFixtureOpts: FixtureOpt = {
        density: 1.0,
        friction: 0.9,
      };

      const wheelBack = world.createDynamicBody(planck.Vec2(-1.0, 0.35));
      wheelBack.createFixture(planck.Circle(0.4), wheelFixtureOpts);

      const wheelFront = world.createDynamicBody(planck.Vec2(1.0, 0.4));
      wheelFront.createFixture(planck.Circle(0.4), wheelFixtureOpts);

      // Bridge
      const bridgeFD: FixtureOpt = {
        density: 1.0,
        friction: 0.6,
      };

      let prevBody = groundBody;
      const bridgeStartX = heights.length * dx + startX;
      const bridgeStartY = heights[heights.length - 1] - 10;
      let i;
      for (i = 0; i < 20; i += 1) {
        const bridgeBlock = world.createDynamicBody(Vec2(bridgeStartX + 2.0 * i, bridgeStartY));
        bridgeBlock.createFixture(planck.Box(1.0, 0.125), bridgeFD);
        world.createJoint(planck.RevoluteJoint({}, prevBody, bridgeBlock, Vec2(bridgeStartX + 2.0 * i, bridgeStartY)));
        prevBody = bridgeBlock;
      }
      world.createJoint(planck.RevoluteJoint({}, prevBody, groundBody, Vec2(bridgeStartX + 2.0 * i, bridgeStartY)));

      // wheel spring settings
      const HZ = 4.0;
      const ZETA = 0.7;
      const SPEED = 50.0;

      const springBack = world.createJoint<WheelJoint>(planck.WheelJoint({
        motorSpeed : 0.0,
        maxMotorTorque : 20.0,
        enableMotor : true,
        frequencyHz : HZ,
        dampingRatio : ZETA
      }, car, wheelBack, wheelBack.getPosition(), planck.Vec2(0.0, 1.0)));

      const springFront = world.createJoint<WheelJoint>(planck.WheelJoint({
        motorSpeed : 0.0,
        maxMotorTorque : 10.0,
        enableMotor : false,
        frequencyHz : HZ,
        dampingRatio : ZETA
      }, car, wheelFront, wheelFront.getPosition(), planck.Vec2(0.0, 1.0)));

      // Setup testbed.
      testbed.speed = 1.3;
      testbed.hz = 50;
      testbed.x = 0;
      testbed.y = 0;
      testbed.width = 50;
      testbed.height = 50;
      testbed.info('Use arrow keys to move player');
      testbed.step = function() {
        // console.log('+++ STEP');
        // testbed.status('score', 5);
        // testbed.status('time', 7);

        if (!springBack || !springFront) {
          return;
        }

        if (testbed.activeKeys.right && testbed.activeKeys.left) {
          springBack.setMotorSpeed(0);
          springBack.enableMotor(true);
        } else if (testbed.activeKeys.right) {
          springBack.setMotorSpeed(-SPEED);
          springBack.enableMotor(true);
        } else if (testbed.activeKeys.left) {
          springBack.setMotorSpeed(+SPEED);
          springBack.enableMotor(true);
        } else {
          springBack.setMotorSpeed(0);
          springBack.enableMotor(false);
        }

        const cp = car.getPosition();
        if (cp.x > testbed.x + 10) {
          testbed.x = cp.x - 10;
        } else if (cp.x < testbed.x - 10) {
          testbed.x = cp.x + 10;
        }

        if (cp.y > testbed.y + 10) {
          testbed.y = -1 * (cp.y - 10);
        } else if (cp.y < testbed.y - 10) {
          testbed.y = -1 * (cp.y + 10);
        }
      };

      return world;
    });



    // // Rendering function
    // function render() {
    //   // Iterate over bodies and fixtures
    //   for (let body = world.getBodyList(); body; body = body.getNext()) {
    //     for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
    //       const position = body.getPosition();
    //       const angle = body.getAngle();
    //       console.log({x: position.x, y: position.y, angle});
    //     }
    //   }
    // }
    //
    // function loop() {
    //   world.step(timeStep, velocityIterations, positionIterations);
    //   render();
    //   // window.requestAnimationFrame(loop);
    // }
    //
    // loop();
  }, []);

  return (
    <div>
      Physics here...
    </div>
  );
}

export default PhysicsTestbed;
