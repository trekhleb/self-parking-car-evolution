import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';
import { Block } from 'baseui/block';

import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import { setSearchParam } from '../../utils/url';
import Hint from '../shared/Hint';
import Row from '../shared/Row';
import { getWorldKeyFromUrl } from './utils/url';
import { WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP } from './constants/url';
import EvolutionTabManual from './EvolutionTabManual';
import EvolutionTabEvolution from './EvolutionTabEvolution';

// @TODO: Refactor world tab selection: use meaningful keys.
export const EVOLUTION_WORLD_KEY = '0';
export const AUTOMATIC_PARKING_WORLD_KEY = '1';
export const MANUAL_PARKING_WORLD_KEY = '2';

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

function EvolutionTabs() {
  const [activeWorldKey, setActiveWorldKey] = useState<string | number>(
    getWorldKeyFromUrl(EVOLUTION_WORLD_KEY)
  );

  const onTabSwitch = ({ activeKey }: {activeKey: React.Key}) => {
    setActiveWorldKey(activeKey);
    setSearchParam(WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP[activeKey]);
  }

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
          <EvolutionTabEvolution />
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
          TODO
          {/*<World withPerfStats={withStat} version={automaticWorldVersion}>*/}
          {/*  <ParkingAutomatic*/}
          {/*    withVisibleSensors={withSensors}*/}
          {/*    withLabels={withLabels}*/}
          {/*    cars={bestCars}*/}
          {/*  />*/}
          {/*</World>*/}
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
          <EvolutionTabManual />
        </ErrorBoundary>
      </Tab>
    </Tabs>
  );
}

export default EvolutionTabs;
