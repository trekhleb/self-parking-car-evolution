import React, { useState } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Select, SIZE as SELECT_SIZE } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { Button, SIZE as BUTTON_SIZE, SHAPE as BUTTON_SHAPE } from 'baseui/button';
import { Slider } from 'baseui/slider';
import { BiReset } from 'react-icons/all';

import { Probability } from '../../lib/genetic';
import FormElementsRow from '../shared/FormElementsRow';

export const SECOND = 1000;
export const DEFAULT_GENERATION_LIFETIME = 30;
export const TRAINED_CAR_GENERATION_LIFETIME = 20;

const GENERATION_SIZES = [10, 50, 100, 200, 500, 1000];
const BATCH_SIZES = [1, 2, 5, 10, 20, 50];

export const DEFAULT_GENERATION_SIZE = GENERATION_SIZES[0];
export const DEFAULT_BATCH_SIZE = BATCH_SIZES[0];
export const DEFAULT_MUTATION_PROBABILITY = 0.2;

type EvolutionBoardParamsProps = {
  generationSize: number,
  batchSize: number,
  mutationProbability: Probability,
  generationLifetime: number,
  onGenerationSizeChange: (size: number) => void,
  onBatchSizeChange: (size: number) => void,
  onGenerationLifetimeChange: (time: number) => void,
  onMutationProbabilityChange: (probability: Probability) => void,
  onReset: () => void,
};

function EvolutionBoardParams(props: EvolutionBoardParamsProps) {
  const {
    generationSize,
    batchSize,
    generationLifetime,
    onGenerationSizeChange,
    onBatchSizeChange,
    onGenerationLifetimeChange,
    mutationProbability,
    onMutationProbabilityChange,
    onReset,
  } = props;

  const [mutationProbabilityInternal, setMutationProbabilityInternal] = useState<Probability>(mutationProbability);
  const [generationLifetimeInternal, setGenerationLifetimeInternal] = useState<number>(generationLifetime);

  const generationSizeCurrentValue = [{
    id: `${generationSize}`,
    size: generationSize,
  }];
  const generationSizes = GENERATION_SIZES.map((size: number) => {
    return {
      id: `${size}`,
      size,
    };
  });
  const generationSizeSelector = (
    <FormControl label={() => 'Generation size'}>
      <Select
        options={generationSizes}
        value={generationSizeCurrentValue}
        onChange={(params: OnChangeParams) => onGenerationSizeChange(params.value[0].size)}
        labelKey="id"
        valueKey="size"
        size={SELECT_SIZE.compact}
        clearable={false}
        searchable={false}
      />
    </FormControl>
  );

  const batchSizeCurrentValue = [{
    id: `${batchSize}`,
    size: batchSize,
  }];
  const batchSizes = BATCH_SIZES.map((size: number) => {
    return {
      id: `${size}`,
      size,
    };
  });
  const batchSizeSelector = (
    <FormControl label={() => 'Group size'}>
      <Select
        options={batchSizes}
        value={batchSizeCurrentValue}
        onChange={(params: OnChangeParams) => onBatchSizeChange(params.value[0].size)}
        labelKey="id"
        valueKey="size"
        size={SELECT_SIZE.compact}
        clearable={false}
        searchable={false}
      />
    </FormControl>
  );

  const sliderOverrides = {
    TickBar: {
      style: {
        paddingBottom: 0,
      },
    },
    InnerThumb: ({$value, $thumbIndex}: {$value: number[], $thumbIndex: number}) => (
      <React.Fragment>{$value[$thumbIndex]}</React.Fragment>
    ),
    ThumbValue: () => null,
    Thumb: {
      style: () => ({
        color: 'white',
        fontSize: '10px',
        fontWeight: 600,
      }),
    },
  };

  const generationLifetimeChanger = (
    <FormControl label={() => 'Generation lifetime, s'}>
      <Slider
        step={5}
        marks
        persistentThumb
        min={10}
        max={30}
        value={[generationLifetimeInternal]}
        onChange={({ value }) => value && setGenerationLifetimeInternal(value[0])}
        onFinalChange={({value}) => onGenerationLifetimeChange(value[0])}
        valueToLabel={(value) => `${value}s`}
        overrides={sliderOverrides}
      />
    </FormControl>
  );

  const mutationProbabilityChanger = (
    <FormControl label={() => 'Gene mutation probability'}>
      <Slider
        step={0.1}
        marks
        persistentThumb
        min={0}
        max={1}
        value={[mutationProbabilityInternal]}
        onChange={({ value }) => value && setMutationProbabilityInternal(value[0])}
        onFinalChange={({value}) => onMutationProbabilityChange(value[0])}
        overrides={sliderOverrides}
      />
    </FormControl>
  );

  const resetButton = (
    <FormControl>
      <Button
        size={BUTTON_SIZE.compact}
        shape={BUTTON_SHAPE.pill}
        onClick={onReset}
        startEnhancer={() => <BiReset size={18} />}
      >
        Reset
      </Button>
    </FormControl>
  );

  return (
    <Block display="flex" flexDirection="column">
      <FormElementsRow
        nodes={[
          generationLifetimeChanger,
          mutationProbabilityChanger,
        ]}
      />
      <FormElementsRow
        nodes={[
          generationSizeSelector,
          batchSizeSelector,
        ]}
        buttons={resetButton}
      />
    </Block>
  );
}

export default EvolutionBoardParams;
