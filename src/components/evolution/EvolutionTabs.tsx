import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import { StyleObject } from 'styletron-standard';
import ErrorBoundary from '../shared/ErrorBoundary';
import { getSearchParam, setSearchParam } from '../../utils/url';
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
        title="Parking Evolution"
      >
        <ErrorBoundary>
          <EvolutionTabEvolution />
        </ErrorBoundary>
      </Tab>

      <Tab
        key={TAB_KEYS.automatic}
        title="Automatic Parking"
      >
        <ErrorBoundary>
          <EvolutionTabAutomatic />
        </ErrorBoundary>
      </Tab>

      <Tab
        key={TAB_KEYS.manual}
        title="Manual Parking"
      >
        <ErrorBoundary>
          <EvolutionTabManual />
        </ErrorBoundary>
      </Tab>
    </Tabs>
  );
}

export default EvolutionTabs;
