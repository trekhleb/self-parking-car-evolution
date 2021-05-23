import React from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import World from '../world/World';
import ParkingAutomatic from '../world/ParkingAutomatic';
import ParkingManual from '../world/ParkingManual';

function HomeScreen() {
  const [activeKey, setActiveKey] = React.useState<string | number>('1');

  return (
    <Tabs
      onChange={({ activeKey }) => { setActiveKey(activeKey); }}
      activeKey={activeKey}
    >
      <Tab title="Automatic Parking">
        <World>
          <ParkingAutomatic />
        </World>
      </Tab>
      <Tab title="Manual Parking">
        <World>
          <ParkingManual />
        </World>
      </Tab>
    </Tabs>
  );
}

export default HomeScreen;
