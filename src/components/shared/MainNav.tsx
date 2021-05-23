import React, { CSSProperties } from 'react';
import { StyledLink } from 'baseui/link';
import { RiFilePaper2Fill, SiGithub } from 'react-icons/all';

function MainNav() {
  const linkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
    marginBottom: '10px',
  };

  const iconStyle: CSSProperties = {
    marginRight: '5px',
  };

  return (
    <nav style={{ display: 'flex', marginBottom: '20px' }}>
      <StyledLink href="https://trekhleb.dev/blog/" style={linkStyle}>
        <RiFilePaper2Fill style={iconStyle} /> How it woks
      </StyledLink>
      <StyledLink href="https://github.com/trekhleb/self-parking-car-evolution" style={linkStyle}>
        <SiGithub style={iconStyle} /> Source-code
      </StyledLink>
    </nav>
  );
}

export default MainNav;
