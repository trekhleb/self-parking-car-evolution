import React, { useEffect, useRef } from 'react';

function Ammo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
  }, []);

  return (
    <div ref={containerRef}>
      Physics here...
    </div>
  );
}

export default Ammo;
