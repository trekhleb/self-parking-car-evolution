import * as React from 'react';

import './FadeIn.css';

type FadeInProps = {
  children: React.ReactNode,
};

function FadeIn(props: FadeInProps) {
  const {children} = props;
  return (
    <div className="component-fade-in">
      {children}
    </div>
  );
}

export default FadeIn
