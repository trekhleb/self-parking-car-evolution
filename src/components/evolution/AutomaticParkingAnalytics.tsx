import React from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE as BUTTON_SIZE, KIND as BUTTON_KIND, SHAPE as BUTTON_SHAPE } from 'baseui/button';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { ButtonGroup, MODE as BUTTON_GROUP_MODE, SIZE as BUTTON_GROUP_SIZE } from 'baseui/button-group';

import EvolutionTiming from './EvolutionTiming';
import BestGenomes from './BestGenomes';
import { Genome } from '../../libs/genetic';
import { FormControl } from 'baseui/form-control';
import Row from '../shared/Row';
import Hint from '../shared/Hint';
import { DynamicCarsPosition } from '../world/constants/cars';

type AutomaticParkingAnalyticsProps = {
  genomes: Genome[],
  generationLifetimeMs: number,
  batchVersion: string,
  bestGenome: Genome | null,
  minLoss: number | null,
  carsBatchIndex: number | null,
  performanceBoost: boolean,
  selectedGenomeIndex: number,
  carsPosition: DynamicCarsPosition,
  onCarsPositionChange: (carsPosition: DynamicCarsPosition) => void,
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
    carsPosition,
    onCarsPositionChange,
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

  const selectedCarsPosition: Record<DynamicCarsPosition, number> = {
    'middle': 0,
    'front': 1,
    'rear': 3,
  };

  const carsPositionFromIndex = (positionIndex: number): DynamicCarsPosition => {
    // @ts-ignore
    const positions: DynamicCarsPosition[] = Object.keys(selectedCarsPosition);
    return positions[positionIndex];
  };

  const carsStartPositionChanger = (
    <Block>
      <FormControl label="Car start position">
        <ButtonGroup
          mode={BUTTON_GROUP_MODE.radio}
          size={BUTTON_GROUP_SIZE.compact}
          selected={selectedCarsPosition[carsPosition]}
          onClick={(_event, index) => {
            onCarsPositionChange(carsPositionFromIndex(index));
          }}
        >
          <Button>Center</Button>
          <Button>Right</Button>
      </ButtonGroup>
      </FormControl>
    </Block>
  );

  return (
    <>
      {timingDetails}

      <Block
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
      >
        <Block marginRight="20px">
          {carsStartPositionChanger}
        </Block>
        <Block marginBottom="5px">
          {performanceBooster}
        </Block>
      </Block>

      {carsSwitcher}

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
