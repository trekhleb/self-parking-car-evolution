import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeJS() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const width = 600;
    const height = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh(geometry, material);
    scene.add( cube );
    camera.position.z = 5;

    containerRef.current.appendChild(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return (
    <div ref={containerRef}>
      Physics here...
    </div>
  );
}

export default ThreeJS;
