import React from 'react';
import { CylinderProps, useCylinder } from '@react-three/cannon';

function Pillar(props: CylinderProps) {
  const args: [number, number, number, number] = [0.7, 0.7, 2, 20]
  const [ref] = useCylinder(() => ({
    mass: 10,
    args,
    ...props,
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderBufferGeometry args={args} />
      <meshPhongMaterial color="darkorange" />
    </mesh>
  )
}

export default Pillar;
