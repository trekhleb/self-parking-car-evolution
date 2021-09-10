import React from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE as BUTTON_SIZE, KIND as BUTTON_KIND, SHAPE as BUTTON_SHAPE } from 'baseui/button';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';

import EvolutionTiming from './EvolutionTiming';
import BestGenomes from './BestGenomes';
import { Genome } from '../../libs/genetic';
import { FormControl } from 'baseui/form-control';
import Row from '../shared/Row';
import Hint from '../shared/Hint';

type AutomaticParkingAnalyticsProps = {
  genomes: Genome[],
  generationLifetimeMs: number,
  batchVersion: string,
  bestGenome: Genome | null,
  minLoss: number | null,
  carsBatchIndex: number | null,
  performanceBoost: boolean,
  selectedGenomeIndex: number,
  onChangeGenomeIndex: (index: number) => void,
  onBestGenomeEdit?: (genome: Genome) => void,
  onPerformanceBoost: (state: boolean) => void,
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
    performanceBoost,
    onChangeGenomeIndex,
    onPerformanceBoost,
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
    <Block
      key={genomeIndex}
      display="inline-block"
      marginRight="4px"
      marginBottom="4px"
    >
      <Button 
        size={BUTTON_SIZE.compact}
        shape={BUTTON_SHAPE.pill}
        kind={genomeIndex === selectedGenomeIndex ? BUTTON_KIND.primary : BUTTON_KIND.secondary}
        onClick={() => {
          onChangeGenomeIndex(genomeIndex);
        }}
      >
        CAR-{genomeIndex}
      </Button>
    </Block>
  ));

  const carsSwitcher = (
    <Block marginTop="20px" marginBottom="20px">
      <FormControl
        label={() => 'Select the pre-trained car genome'}
      >
        <Block>
          {carLicencePlates}
        </Block>
      </FormControl>
    </Block>
  );

  const performanceBooster = (
    <FormControl>
      <Block>
        <Checkbox
          checked={performanceBoost}
          // @ts-ignore
          onChange={e => onPerformanceBoost(e.target.checked)}
          labelPlacement={LABEL_PLACEMENT.right}
        >
          <Row>
            <Block marginRight="5px">
              <small>Performance boost</small>
            </Block>
            <Hint
              hint="Speed up the simulation by simplifying the geometry"
            />
          </Row>
        </Checkbox>
      </Block>
    </FormControl>
  );

  return (
    <>
      {timingDetails}
      {carsSwitcher}
      {performanceBooster}
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
