import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import World from '../world/World';
import ParkingAutomatic from './parkings/ParkingAutomatic';
import ParkingManual from './parkings/ParkingManual';
import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import WorldParamsController from './controllers/WorldParamsController';
import { CarType } from './types/car';
import { getSearchParam } from '../../utils/url';
import { Block } from 'baseui/block';
import Hint from '../shared/Hint';
import Row from '../shared/Row';

export const EVOLUTION_WORLD_KEY = '0';
export const AUTOMATIC_PARKING_WORLD_KEY = '1';
export const MANUAL_PARKING_WORLD_KEY = '2';

const STAT_SEARCH_PARAM_NAME = 'stats';

type WorldsProps = {
  cars: CarType[],
  bestCars: CarType[],
  activeWorldKey: string | number,
  onWorldSwitch?: (worldKey: React.Key) => void,
  evolutionWorldVersion?: string,
  automaticWorldVersion?: string,
  withWorldParams?: boolean,
};

function Worlds(props: WorldsProps) {
  const {
    cars,
    bestCars,
    activeWorldKey,
    onWorldSwitch = (worldKey) => {},
    evolutionWorldVersion = '0',
    automaticWorldVersion = '0',
    withWorldParams = false,
  } = props;

  const [withSensors, setWithSensors] = useState<boolean>(true);
  const [withLabels, setWithLabels] = useState<boolean>(true);
  const [withStat, setWithStat] = useState<boolean>(!!getSearchParam(STAT_SEARCH_PARAM_NAME));

  const tabBarStyle: StyleObject = {
    paddingLeft: 0,
    paddingRight: 0,
    overflow: 'hidden',
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
      <Tab
        title={(
          <Row>
            <Block marginRight="7px">Parking Evolution</Block>
            <Hint hint="Using the Genetic Algorithm to train the car to do self-parking" />
          </Row>
        )}
      >
        <ErrorBoundary>
          <World withPerfStats={withStat} version={evolutionWorldVersion}>
            <ParkingAutomatic
              withVisibleSensors={withSensors}
              withLabels={withLabels}
              cars={cars}
            />
          </World>
          {worldParamsController}
        </ErrorBoundary>
      </Tab>

      <Tab
        title={(
          <Row>
            <Block marginRight="7px">Automatic Parking</Block>
            <Hint hint="See trained self-parking car in action" />
          </Row>
        )}
      >
        <ErrorBoundary>
          <World withPerfStats={withStat} version={automaticWorldVersion}>
            <ParkingAutomatic
              withVisibleSensors={withSensors}
              withLabels={withLabels}
              cars={bestCars}
            />
          </World>
          {worldParamsController}
        </ErrorBoundary>
      </Tab>

      <Tab
        title={(
          <Row>
            <Block marginRight="7px">Manual Parking</Block>
            <Hint hint="Try to park the car by yourself" />
          </Row>
        )}
      >
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
