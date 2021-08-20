import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, LightTheme } from 'baseui';
import { Cell, Grid } from 'baseui/layout-grid';
import { SnackbarProvider } from 'baseui/snackbar';

import './Layout.css';
import Header from './Header';
import MainNav from './MainNav';
import Footer from './Footer';

const engine = new Styletron();

type LayoutProps = {
  children: React.ReactNode,
};

function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <SnackbarProvider>
          <Grid>
            <Cell span={[4, 8, 12]}>
              <Header />
              <MainNav />
            </Cell>
            <Cell span={[4, 8, 12]}>
              {children}
            </Cell>
            <Cell span={[4, 8, 12]}>
              <Footer />
            </Cell>
          </Grid>
        </SnackbarProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default Layout;
