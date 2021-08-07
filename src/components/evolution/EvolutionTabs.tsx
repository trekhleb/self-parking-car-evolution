import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';
import { Block } from 'baseui/block';

import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import { getSearchParam, setSearchParam } from '../../utils/url';
import Hint from '../shared/Hint';
import Row from '../shared/Row';
import EvolutionTabManual from './EvolutionTabManual';
import EvolutionTabEvolution from './EvolutionTabEvolution';
import EvolutionTabAutomatic from './EvolutionTabAutomatic';

const WORLD_SEARCH_PARAM = 'parking';

const TAB_KEYS: Record<string, string> = {
  evolution: 'evolution',
  automatic: 'automatic',
  manual: 'manual',
};

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
  let worldKey: string = getSearchParam(WORLD_SEARCH_PARAM) || TAB_KEYS.evolution;
  if (!TAB_KEYS.hasOwnProperty(worldKey)) {
    worldKey = TAB_KEYS.evolution;
  }

  const [activeWorldKey, setActiveWorldKey] = useState<string | number>(worldKey);

  const onTabSwitch = ({ activeKey }: {activeKey: React.Key}) => {
    setActiveWorldKey(activeKey);
    setSearchParam(WORLD_SEARCH_PARAM, `${activeKey}`);
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
        key={TAB_KEYS.evolution}
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
        key={TAB_KEYS.automatic}
        title={(
          <Row>
            <Block marginRight="7px">Automatic Parking</Block>
            <Hint hint="See trained self-parking car in action" />
          </Row>
        )}
      >
        <ErrorBoundary>
          <EvolutionTabAutomatic />
        </ErrorBoundary>
      </Tab>

      <Tab
        key={TAB_KEYS.manual}
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
