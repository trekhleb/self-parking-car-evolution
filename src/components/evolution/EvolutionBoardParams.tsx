import React from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Select, SIZE as SELECT_SIZE } from 'baseui/select';
import { FormControl } from 'baseui/form-control';

const GENERATION_SIZES = [10, 50, 100];
const BATCH_SIZES = [1, 5, 10, 20];

export const DEFAULT_GENERATION_SIZE = GENERATION_SIZES[0];
export const DEFAULT_BATCH_SIZE = BATCH_SIZES[0];

type EvolutionBoardParamsProps = {
  generationSize: number,
  batchSize: number,
  onGenerationSizeChange: (size: number) => void;
  onBatchSizeChange: (size: number) => void;
};

function EvolutionBoardParams(props: EvolutionBoardParamsProps) {
  const {
    generationSize,
    batchSize,
    onGenerationSizeChange,
    onBatchSizeChange,
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

  return (
    <Block display="flex" flexDirection="row">
      <Block flex={1} marginRight="10px">
        <FormControl
          label={() => 'Generation Size'}
        >
          {generationSizeSelector}
        </FormControl>
      </Block>
      <Block flex={1} marginLeft="10px">
        <FormControl
          label={() => 'Batch Size'}
        >
          {batchSizeSelector}
        </FormControl>
      </Block>
    </Block>
  );
}

export default EvolutionBoardParams;
