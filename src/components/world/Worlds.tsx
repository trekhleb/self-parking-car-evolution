import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import World from '../world/World';
import ParkingAutomatic from './parkings/ParkingAutomatic';
import ParkingManual from './parkings/ParkingManual';
import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import WorldParamsController from './controllers/WorldParamsController';
import { CarsType } from './types/car';

type WorldsProps = {
  cars: CarsType,
  onWorldSwitch?: (worldKey: React.Key) => void,
};

function Worlds(props: WorldsProps) {
  const { cars, onWorldSwitch = (worldKey) => {} } = props;

  const [activeKey, setActiveKey] = React.useState<string | number>('1');

  const [withStat, setWithStat] = useState<boolean>(true);
  const [withSensors, setWithSensors] = useState<boolean>(true);
  const [withLabels, setWithLabels] = useState<boolean>(false);

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

  const onTabSwitch = ({ activeKey }: {activeKey: React.Key}) => {
    setActiveKey(activeKey);
    onWorldSwitch(activeKey);
  }

  const worldParamsController = (
    <WorldParamsController
      withSensors={withSensors}
      withLabels={withLabels}
      withStat={withStat}
      onWithLabelsChange={setWithLabels}
      onWithStatChange={setWithStat}
      onWithSensorsChange={setWithSensors}
    />
  );

  return (
    <Tabs
      overrides={{
        TabBar: { style: tabBarStyle },
        TabContent: { style: tabContentStyle },
        Tab: { style: tabStyle },
      }}
      onChange={onTabSwitch}
      activeKey={activeKey}
    >
      <Tab title="Automatic Parking">
        <ErrorBoundary>
          <World
            withKeyboardControl
            withPerfStats={withStat}
          >
            <ParkingAutomatic
              withVisibleSensors={withSensors}
              withLabels={withLabels}
              cars={cars}
            />
          </World>
          {worldParamsController}
        </ErrorBoundary>
      </Tab>

      <Tab title="Manual Parking">
        <ErrorBoundary>
          <World
            withPerfStats={withStat}
            withJoystickControl
            withKeyboardControl
          >
            <ParkingManual
              withLabels={withLabels}
              withSensors={withSensors}
            />
          </World>
          {worldParamsController}
        </ErrorBoundary>
      </Tab>
    </Tabs>
  );
}

export default Worlds;
