import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import World from '../world/World';
import ParkingAutomatic from './parkings/ParkingAutomatic';
import ParkingManual from './parkings/ParkingManual';
import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import WorldParamsController from './controllers/WorldParamsController';
import { CarType } from './types/car';

export const EVOLUTION_WORLD_KEY = '0';
export const MANUAL_PARKING_WORLD_KEY = '1';

type WorldsProps = {
  cars: CarType[],
  activeWorldKey: string | number,
  onWorldSwitch?: (worldKey: React.Key) => void,
  version?: string,
  withWorldParams?: boolean,
};

function Worlds(props: WorldsProps) {
  const {
    cars,
    activeWorldKey,
    onWorldSwitch = (worldKey) => {},
    version = '0',
    withWorldParams = false,
  } = props;

  const [withSensors, setWithSensors] = useState<boolean>(true);
  const [withLabels, setWithLabels] = useState<boolean>(true);
  const [withStat, setWithStat] = useState<boolean>(true);

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
    onWorldSwitch(activeKey);
  }

  const worldParamsController = withWorldParams ? (
    <WorldParamsController
      withSensors={withSensors}
      withLabels={withLabels}
      withStat={withStat}
      onWithLabelsChange={setWithLabels}
      onWithStatChange={setWithStat}
      onWithSensorsChange={setWithSensors}
    />
  ) : null;

  return (
    <Tabs
      overrides={{
        TabBar: { style: tabBarStyle },
        TabContent: { style: tabContentStyle },
        Tab: { style: tabStyle },
      }}
      onChange={onTabSwitch}
      activeKey={activeWorldKey}
    >
      <Tab title="Automatic Parking">
        <ErrorBoundary>
          <World withPerfStats={withStat} version={version}>
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
