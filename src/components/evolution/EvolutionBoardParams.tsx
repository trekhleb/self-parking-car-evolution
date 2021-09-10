import React, { useEffect, useState } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Select, SIZE as SELECT_SIZE } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { 
  Button,
  SIZE as BUTTON_SIZE,
  SHAPE as BUTTON_SHAPE,
  KIND as BUTTON_KIND,
} from 'baseui/button';
import { Slider } from 'baseui/slider';
import { BiReset } from 'react-icons/all';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from 'baseui/modal';
import { Notification, KIND as NOTIFICATION_KIND } from 'baseui/notification';

import { Percentage, Probability } from '../../libs/genetic';
import FormElementsRow from '../shared/FormElementsRow';
import Hint from '../shared/Hint';
import Row from '../shared/Row';
import { GENOME_LENGTH } from '../../libs/carGenetic';

export const SECOND: number = 1000;

const GENERATION_SIZES: number[] = [4, 10, 50, 100, 200, 500, 1000, 2000];
const BATCH_SIZES: number[] = [1, 2, 3, 5, 10, 15, 20, 30, 50, 100];

export const DEFAULT_PERFORMANCE_BOOST: boolean = false;
export const DEFAULT_GENERATION_SIZE: number = 100;
export const DEFAULT_BATCH_SIZE: number = 2;
export const DEFAULT_MUTATION_PROBABILITY: Probability = 0.04;
export const DEFAULT_LONG_LIVING_CHAMPIONS_PERCENTAGE: Percentage = 6;
export const DEFAULT_GENERATION_LIFETIME: number = 17;
export const TRAINED_CAR_GENERATION_LIFETIME: number = DEFAULT_GENERATION_LIFETIME;

type EvolutionBoardParamsProps = {
  generationSize: number,
  batchSize: number,
  mutationProbability: Probability,
  longLivingChampionsPercentage: Percentage,
  generationLifetime: number,
  performanceBoost: boolean,
  onGenerationSizeChange: (size: number) => void,
  onBatchSizeChange: (size: number) => void,
  onGenerationLifetimeChange: (time: number) => void,
  onMutationProbabilityChange: (probability: Probability) => void,
  onLongLivingChampionsPercentageChange: (percentage: Percentage) => void,
  onPerformanceBoost: (state: boolean) => void,
  onReset: () => void,
};

function EvolutionBoardParams(props: EvolutionBoardParamsProps) {
  const {
    generationSize,
    batchSize,
    generationLifetime,
    longLivingChampionsPercentage,
    onGenerationSizeChange,
    performanceBoost,
    onBatchSizeChange,
    onGenerationLifetimeChange,
    mutationProbability,
    onMutationProbabilityChange,
    onLongLivingChampionsPercentageChange,
    onPerformanceBoost,
    onReset,
  } = props;

  const [mutationProbabilityInternal, setMutationProbabilityInternal] = useState<Probability>(mutationProbability);
  const [generationLifetimeInternal, setGenerationLifetimeInternal] = useState<number>(generationLifetime);
  const [longLivingChampionsPercentageInternal, setLongLivingChampionsPercentageInternal] = useState<Percentage>(longLivingChampionsPercentage);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setMutationProbabilityInternal(mutationProbability);
    setGenerationLifetimeInternal(generationLifetime);
    setLongLivingChampionsPercentageInternal(longLivingChampionsPercentage);
  }, [mutationProbability, generationLifetime, longLivingChampionsPercentage]);

  const onConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const onConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const onConfirmationModalConfirm = () => {
    setConfirmationModalOpen(false);
    onReset();
  };

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

  const genesToBeMutated = Math.floor(GENOME_LENGTH * mutationProbabilityInternal);

  const mutationProbabilityChanger = (
    <FormControl
      label={() => 'Gene mutation probability, %'}
      caption={() => `≈${genesToBeMutated} out of ${GENOME_LENGTH} car genes will be mutated`}
    >
      <Slider
        step={1}
        marks={false}
        persistentThumb
        min={0}
        max={100}
        value={[Math.floor(mutationProbabilityInternal * 100)]}
        onChange={({ value }) => value && setMutationProbabilityInternal(value[0] / 100)}
        onFinalChange={({value}) => onMutationProbabilityChange(value[0] / 100)}
        valueToLabel={(value) => `${value}%`}
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
        onClick={onConfirmationModalOpen}
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

  const performanceBooster = (
    <Block>
      <FormControl>
        <Block marginTop="10px">
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
    </Block>
  );

  const resetConfirmationModal = (
    <Modal
      onClose={onConfirmationModalClose}
      closeable
      isOpen={confirmationModalOpen}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
    >
      <ModalHeader>
        Confirm evolution resetting
      </ModalHeader>
      <ModalBody>
        <Notification
          kind={NOTIFICATION_KIND.warning}
          overrides={{
            Body: {style: {width: 'auto'}},
          }}
        >
          Resetting will clear the evolution configuration and also the training progress
        </Notification>
      </ModalBody>
      <ModalFooter>
        <ModalButton
          size={BUTTON_SIZE.compact}
          shape={BUTTON_SHAPE.pill}
          onClick={onConfirmationModalClose}
          kind={BUTTON_KIND.tertiary}
        >
          Cancel
        </ModalButton>
        <ModalButton
          size={BUTTON_SIZE.compact}
          shape={BUTTON_SHAPE.pill}
          onClick={onConfirmationModalConfirm}
          kind={BUTTON_KIND.primary}
          startEnhancer={() => <BiReset size={18} />}
        >
          Reset
        </ModalButton>
      </ModalFooter>
    </Modal>
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
      <FormElementsRow
        nodes={[
          performanceBooster,
        ]}
      />
      {resetConfirmationModal}
    </Block>
  );
}

export default EvolutionBoardParams;
