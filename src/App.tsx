import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Layout from './components/shared/Layout';
import { routes } from './constants/routes';
import HomeScreen from './components/screens/HomeScreen';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Switch>
          <Route path={[routes.home.path]} exact>
            <ErrorBoundary>
              <HomeScreen />
            </ErrorBoundary>
          </Route>
        </Switch>
      </Layout>
    </HashRouter>
  );
}

export default App;
