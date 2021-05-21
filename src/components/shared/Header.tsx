import React from 'react';
import { H5 } from 'baseui/typography';

function Header() {
  return (
    <div>
      <H5 $style={{ fontWeight: 800, textTransform: 'uppercase' }}>
        Self-Parking Car Evolution
      </H5>
    </div>
  );
}

export default Header;
