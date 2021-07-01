import React, { FormEvent } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Select, SIZE as SELECT_SIZE } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { Input, SIZE as INPUT_SIZE } from 'baseui/input';

export const SECOND = 1000;
export const DEFAULT_GENERATION_LIFETIME = 30;

const GENERATION_SIZES = [10, 50, 100];
const BATCH_SIZES = [1, 5, 10, 20];

export const DEFAULT_GENERATION_SIZE = GENERATION_SIZES[0];
export const DEFAULT_BATCH_SIZE = BATCH_SIZES[0];

type EvolutionBoardParamsProps = {
  generationSize: number,
  batchSize: number,
  generationLifetime: number,
  onGenerationSizeChange: (size: number) => void;
  onBatchSizeChange: (size: number) => void;
  onGenerationLifetimeChange: (time: number) => void;
};

function EvolutionBoardParams(props: EvolutionBoardParamsProps) {
  const {
    generationSize,
    batchSize,
    generationLifetime,
    onGenerationSizeChange,
    onBatchSizeChange,
    onGenerationLifetimeChange,
  } = props;

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
  );

  const generationLifetimeChanger = (
    <Input
      value={generationLifetime}
      size={INPUT_SIZE.compact}
      // @ts-ignore
      onChange={(e: FormEvent<HTMLInputElement>) => onGenerationLifetimeChange(e.target.value)}
      endEnhancer={() => <span>s</span>}
      type="number"
      min={5}
    />
  );

  return (
    <Block display="flex" flexDirection="row">
      <Block flex={1} marginRight="10px">
        <FormControl label={() => 'Generation size'}>
          {generationSizeSelector}
        </FormControl>
      </Block>

      <Block flex={1} marginLeft="10px" marginRight="10px">
        <FormControl label={() => 'Group size'}>
          {batchSizeSelector}
        </FormControl>
      </Block>

      <Block flex={1} marginLeft="10px">
        <FormControl label={() => 'Generation lifetime'}>
          {generationLifetimeChanger}
        </FormControl>
      </Block>
    </Block>
  );
}

export default EvolutionBoardParams;
