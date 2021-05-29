import React from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import World from '../world/World';
import ParkingAutomatic from '../world/parkings/ParkingAutomatic';
import ParkingManual from '../world/parkings/ParkingManual';
import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';

function HomeScreen() {
  const [activeKey, setActiveKey] = React.useState<string | number>('1');

  const tabBarStyle: StyleObject = {
    paddingLeft: 0,
    paddingRight: 0,
  };

  const tabContentStyle: StyleObject = {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };

  const tabStyle: StyleObject = {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: '20px',
    paddingRight: '20px',
  };

  return (
    <Tabs
      overrides={{
        TabBar: { style: tabBarStyle },
        TabContent: { style: tabContentStyle },
        Tab: { style: tabStyle },
      }}
      onChange={({ activeKey }) => { setActiveKey(activeKey); }}
      activeKey={activeKey}
    >
      <Tab title="Automatic Parking">
        <ErrorBoundary>
          <World>
            <ParkingAutomatic />
          </World>
        </ErrorBoundary>
      </Tab>
      <Tab title="Manual Parking">
        <ErrorBoundary>
          <World>
            <ParkingManual />
          </World>
        </ErrorBoundary>
      </Tab>
    </Tabs>
  );
}

export default HomeScreen;
