import React, { useEffect, useRef } from 'react';
import * as OIMO from 'oimo';

function OimoJS() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // const width = 600;
    // const height = 400;

    const world = new OIMO.World({
      timestep: 1 / 60,
      iterations: 8,
      broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
      worldscale: 1, // scale full world
      random: true,  // randomize sample
      info: false,   // calculate statistic or not
      gravity: [0, -9.8, 0]
    });

    const body = world.add({
      type: 'sphere', // type of shape : sphere, box, cylinder
      size: [1, 1, 1], // size of shape
      pos: [0, 0, 0], // start position in degree
      rot: [0, 0, 90], // start rotation in degree
      move: true, // dynamic or statique
      density: 1,
      friction: 0.2,
      restitution: 0.2,
      belongsTo: 1, // The bits of the collision groups to which the shape belongs.
      collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    });

    // const body = world.add({
    //   type: 'jointHinge', // type of joint : jointDistance, jointHinge, jointPrisme, jointSlide, jointWheel
    //   body1: 'b1', // name or id of attach rigidbody
    //   body2: 'b1' // name or id of attach rigidbody
    // });

    // update world
    world.step();
  }, []);

  return (
    <div ref={containerRef}>
      Physics here...
    </div>
  );
}

export default OimoJS;
