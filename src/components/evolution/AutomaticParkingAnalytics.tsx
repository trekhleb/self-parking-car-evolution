import React from 'react';
import { Block } from 'baseui/block';

import EvolutionTiming from './EvolutionTiming';
import BestGenomes from './BestGenomes';
import { Genome } from '../../lib/genetic';

type AutomaticParkingAnalyticsProps = {
  generationLifetimeMs: number,
  batchVersion: string,
  bestGenome: Genome | null,
  minLoss: number | null,
  carsBatchIndex: number | null,
};

function AutomaticParkingAnalytics(props: AutomaticParkingAnalyticsProps) {
  const {
    bestGenome,
    generationLifetimeMs,
    batchVersion,
    minLoss,
    carsBatchIndex,
  } = props;

  const timingDetails = (
    <Block marginBottom="30px" marginTop="30px">
      <EvolutionTiming
        batchIndex={carsBatchIndex}
        batchVersion={batchVersion}
        generationLifetimeMs={generationLifetimeMs}
        groupLabel="Parking attempt"
        batchLifetimeLabel="Lifetime"
      />
    </Block>
  );

  return (
    <>
      {timingDetails}
      <BestGenomes
        bestGenomePanelTitle="Self-parking car genome"
        bestGenome={bestGenome}
        minLoss={minLoss}
      />
    </>
  );
}

export default AutomaticParkingAnalytics;
