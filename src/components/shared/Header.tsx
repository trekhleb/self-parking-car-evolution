import React from 'react';
import { H5, Paragraph3 } from 'baseui/typography';
import { routes } from '../../constants/routes';
import { useHistory } from 'react-router-dom';
import { StyledLink } from 'baseui/link';
import { GiDna2 } from 'react-icons/all';

function Header() {
  const history = useHistory();

  const onClick = () => {
    history.push(routes.home.path);
  };

  return (
    <div style={{ margin: '30px 0' }}>
      <StyledLink
        onClick={onClick}
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <H5
          $style={{
            fontWeight: 800,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            margin: '0',
          }}
        >
          Self-Parking Car <GiDna2 size={30} style={{ margin: '0 10px' }} /> Evolution
        </H5>
      </StyledLink>
      <Paragraph3 $style={{ marginTop: '5px' }}>
        Training the car to do self-parking using genetic algorithm
      </Paragraph3>
    </div>
  );
}

export default Header;
