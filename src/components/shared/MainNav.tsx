import React from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../constants/routes';

function MainNav() {
  return (
    <nav>
      <NavLink to={routes.manualParking.path}>
        Manual Parking
      </NavLink>
      <NavLink to={routes.automaticParking.path}>
        Automatic Parking
      </NavLink>
    </nav>
  );
}

export default MainNav;
