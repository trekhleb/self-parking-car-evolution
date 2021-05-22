import React from 'react';
import { H5 } from 'baseui/typography';
import { Link } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { StyledLink } from 'baseui/link';

function Header() {
  return (
    <Link to={routes.main.path} component={StyledLink}>
      <H5 $style={{ fontWeight: 800, textTransform: 'uppercase' }}>
        Self-Parking Car Evolution
      </H5>
    </Link>
  );
}

export default Header;
