import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';

import './Layout.css';

const engine = new Styletron();

type LayoutProps = {
  children: React.ReactNode,
};

function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Container>
          {children}
        </Container>
      </BaseProvider>
    </StyletronProvider>
  );
}

const Container = styled('div', {
  height: '600px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
});

export default Layout;
