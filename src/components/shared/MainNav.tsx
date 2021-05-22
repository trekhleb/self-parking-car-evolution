import React from 'react';
import { NavLink } from 'react-router-dom';
import { StyledLink } from 'baseui/link';

import { routes } from '../../constants/routes';

function MainNav() {
  return (
    <nav>
      <NavLink to={routes.main.path} component={StyledLink} exact>
        Park by myself
      </NavLink>
      <NavLink to={routes.automaticParking.path} component={StyledLink} exact>
        Teach car to park
      </NavLink>
    </nav>
  );
}

export default MainNav;
