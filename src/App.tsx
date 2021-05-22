import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Layout from './components/shared/Layout';
import ManualParkingScreen from './components/screens/ManualParkingScreen';
import AutomaticParkingScreen from './components/screens/AutomaticParkingScreen';
import { routes } from './constants/routes';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Switch>
          <Route path={[routes.home.path, routes.manualParking.path]} exact>
            <ManualParkingScreen />
          </Route>
          <Route path={routes.automaticParking.path} exact>
            <AutomaticParkingScreen />
          </Route>
        </Switch>
      </Layout>
    </HashRouter>
  );
}

export default App;
