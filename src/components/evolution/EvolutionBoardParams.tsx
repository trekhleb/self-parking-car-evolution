import React, { useEffect, useState } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Select, SIZE as SELECT_SIZE } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { Button, SIZE as BUTTON_SIZE, SHAPE as BUTTON_SHAPE } from 'baseui/button';
import { Slider } from 'baseui/slider';
import { BiReset } from 'react-icons/all';

import { Percentage, Probability } from '../../libs/genetic';
import FormElementsRow from '../shared/FormElementsRow';

export const SECOND = 1000;

const GENERATION_SIZES = [4, 10, 50, 100, 200, 500, 1000];
const BATCH_SIZES = [1, 2, 5, 10, 20, 50];

export const DEFAULT_GENERATION_SIZE = GENERATION_SIZES[1];
export const DEFAULT_BATCH_SIZE = BATCH_SIZES[2];
export const DEFAULT_MUTATION_PROBABILITY = 0.1;
export const DEFAULT_LONG_LIVING_CHAMPIONS_PERCENTAGE = 20;
export const DEFAULT_GENERATION_LIFETIME = 20;
export const TRAINED_CAR_GENERATION_LIFETIME = 20;

type EvolutionBoardParamsProps = {
  generationSize: number,
  batchSize: number,
  mutationProbability: Probability,
  longLivingChampionsPercentage: Percentage,
  generationLifetime: number,
  onGenerationSizeChange: (size: number) => void,
  onBatchSizeChange: (size: number) => void,
  onGenerationLifetimeChange: (time: number) => void,
  onMutationProbabilityChange: (probability: Probability) => void,
  onLongLivingChampionsPercentageChange: (percentage: Percentage) => void,
  onReset: () => void,
};

function EvolutionBoardParams(props: EvolutionBoardParamsProps) {
  const {
    generationSize,
    batchSize,
    generationLifetime,
    longLivingChampionsPercentage,
    onGenerationSizeChange,
    onBatchSizeChange,
    onGenerationLifetimeChange,
    mutationProbability,
    onMutationProbabilityChange,
    onLongLivingChampionsPercentageChange,
    onReset,
  } = props;

  const [mutationProbabilityInternal, setMutationProbabilityInternal] = useState<Probability>(mutationProbability);
  const [generationLifetimeInternal, setGenerationLifetimeInternal] = useState<number>(generationLifetime);
  const [longLivingChampionsPercentageInternal, setLongLivingChampionsPercentageInternal] = useState<Percentage>(longLivingChampionsPercentage);

  useEffect(() => {
    setMutationProbabilityInternal(mutationProbability);
    setGenerationLifetimeInternal(generationLifetime);
    setLongLivingChampionsPercentageInternal(longLivingChampionsPercentage);
  }, [mutationProbability, generationLifetime, longLivingChampionsPercentage]);

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
    <FormControl
      label={() => 'Generation lifetime, s'}
      caption={() => 'Time the cars have for parking'}
    >
      <Slider
        step={1}
        marks={false}
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
    <FormControl
      label={() => 'Gene mutation probability'}
      caption={() => `Every gene will be mutated with ${mutationProbabilityInternal} probability`}
    >
      <Slider
        step={0.1}
        marks={false}
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

  const longLivingChampionsCount = Math.floor(generationSize * longLivingChampionsPercentageInternal / 100);
  const longLivingChampionsChanger = (
    <FormControl
      label={() => 'Long-living champions, %'}
      caption={() => `${longLivingChampionsCount} best cars will be copied to the next generation`}
    >
      <Slider
        step={1}
        marks={false}
        persistentThumb
        min={0}
        max={100}
        value={[longLivingChampionsPercentageInternal]}
        onChange={({ value }) => value && setLongLivingChampionsPercentageInternal(value[0])}
        onFinalChange={({value}) => onLongLivingChampionsPercentageChange(value[0])}
        valueToLabel={(value) => `${value}%`}
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
        overrides={{
          BaseButton: {
            props: {
              title: 'Reset evolution configuration and training progress',
            },
          },
        }}
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
          longLivingChampionsChanger,
        ]}
      />
      <FormElementsRow
        nodes={[
          generationSizeSelector,
          batchSizeSelector,
        ]}
        buttons={resetButton}
        alignBottom
      />
    </Block>
  );
}

export default EvolutionBoardParams;
