import React from 'react';
import { Block } from 'baseui/block';
import { 
  ButtonGroup, 
  MODE as BUTTON_GROUP_MODE, 
  SIZE as BUTTON_GROUP_SIZE,
} from 'baseui/button-group';
import { Button } from 'baseui/button';

import EvolutionTiming from './EvolutionTiming';
import BestGenomes from './BestGenomes';
import { Genome } from '../../libs/genetic';

type AutomaticParkingAnalyticsProps = {
  genomes: Genome[],
  generationLifetimeMs: number,
  batchVersion: string,
  bestGenome: Genome | null,
  minLoss: number | null,
  carsBatchIndex: number | null,
  selectedGenomeIndex: number,
  onChangeGenomeIndex: (index: number) => void,
  onBestGenomeEdit?: (genome: Genome) => void,
};

function AutomaticParkingAnalytics(props: AutomaticParkingAnalyticsProps) {
  const {
    genomes,
    bestGenome,
    generationLifetimeMs,
    batchVersion,
    minLoss,
    carsBatchIndex,
    selectedGenomeIndex,
    onChangeGenomeIndex,
    onBestGenomeEdit = (genome: Genome) => {},
  } = props;

  const timingDetails = (
    <Block marginBottom="20px" marginTop="20px">
      <EvolutionTiming
        batchIndex={carsBatchIndex}
        batchVersion={batchVersion}
        generationLifetimeMs={generationLifetimeMs}
        groupLabel="Parking attempt"
        batchLifetimeLabel="Lifetime"
      />
    </Block>
  );

  const carLicencePlates = genomes.map((genome: Genome, genomeIndex: number) => (
    <Button key={genomeIndex}>
      CAR-{genomeIndex}
    </Button>
  ));

  const carsSwitcher = (
    <ButtonGroup
      size={BUTTON_GROUP_SIZE.compact}
      mode={BUTTON_GROUP_MODE.radio}
      selected={selectedGenomeIndex}
      onClick={(_event, index) => {
        onChangeGenomeIndex(index);
      }}
    >
      {carLicencePlates}
    </ButtonGroup>
  );

  return (
    <>
      {timingDetails}
      <Block marginTop="20px">
        {carsSwitcher}
      </Block>
      <BestGenomes
        bestGenomePanelTitle="Self-parking car genome"
        bestGenome={bestGenome}
        minLoss={minLoss}
        onBestGenomeEdit={onBestGenomeEdit}
        editable
      />
    </>
  );
}

export default AutomaticParkingAnalytics;
