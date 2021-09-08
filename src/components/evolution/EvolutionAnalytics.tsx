import React from 'react';
import { Block } from 'baseui/block';

import PopulationTable, { CarsInProgressType, CarsLossType } from './PopulationTable';
import EvolutionBoardParams from './EvolutionBoardParams';
import EvolutionTiming from './EvolutionTiming';
import LossHistory from './LossHistory';
import BestGenomes from './BestGenomes';
import { CarLicencePlateType, CarsType } from '../world/types/car';
import { Genome, Percentage, Probability } from '../../libs/genetic';

type EvolutionAnalyticsProps = {
  generationIndex: number | null,
  carsBatchIndex: number | null,
  totalBatches: number | null,
  worldIndex: number,
  generationLifetimeMs: number,
  generationSize: number,
  carsBatchSize: number,
  mutationProbability: Probability,
  performanceBoost: boolean,
  needToRetry: boolean,
  longLivingChampionsPercentage: Percentage,
  generationLifetime: number,
  batchVersion: string,
  onGenerationSizeChange: (size: number) => void,
  onBatchSizeChange: (size: number) => void,
  onGenerationLifetimeChange: (time: number) => void,
  onReset: () => void,
  onMutationProbabilityChange: (probability: Probability) => void,
  onLongLivingChampionsPercentageChange: (percentage: Percentage) => void,
  onPerformanceBoost: (state: boolean) => void,
  lossHistory: number[],
  avgLossHistory: number[],
  cars: CarsType,
  carsInProgress: CarsInProgressType,
  carsLoss: CarsLossType[],
  bestGenome: Genome | null,
  bestCarLicencePlate: CarLicencePlateType | null,
  minLoss: number | null,
  secondBestGenome: Genome | null,
  secondBestCarLicencePlate: CarLicencePlateType | null,
  secondMinLoss: number | null,
};

function EvolutionAnalytics(props: EvolutionAnalyticsProps) {
  const {
    generationIndex,
    carsBatchIndex,
    totalBatches,
    needToRetry,
    mutationProbability,
    longLivingChampionsPercentage,
    worldIndex,
    generationLifetimeMs,
    generationSize,
    performanceBoost,
    carsBatchSize,
    generationLifetime,
    batchVersion,
    onGenerationSizeChange,
    onBatchSizeChange,
    onGenerationLifetimeChange,
    onReset,
    onMutationProbabilityChange,
    onLongLivingChampionsPercentageChange,
    onPerformanceBoost,
    lossHistory,
    avgLossHistory,
    cars,
    carsInProgress,
    carsLoss,
    bestGenome,
    bestCarLicencePlate,
    minLoss,
    secondBestGenome,
    secondBestCarLicencePlate,
    secondMinLoss,
  } = props;

  const timingDetails = (
    <Block marginBottom="30px" marginTop="20px">
      <EvolutionTiming
        generationIndex={generationIndex}
        batchIndex={carsBatchIndex}
        totalBatches={totalBatches}
        batchVersion={batchVersion}
        worldVersion={`${worldIndex}`}
        generationLifetimeMs={generationLifetimeMs}
        retry={needToRetry}
      />
    </Block>
  );

  const evolutionParams = (
    <Block marginBottom="30px">
      <EvolutionBoardParams
        generationSize={generationSize}
        batchSize={carsBatchSize}
        mutationProbability={mutationProbability}
        generationLifetime={generationLifetime}
        longLivingChampionsPercentage={longLivingChampionsPercentage}
        performanceBoost={performanceBoost}
        onGenerationSizeChange={onGenerationSizeChange}
        onBatchSizeChange={onBatchSizeChange}
        onGenerationLifetimeChange={onGenerationLifetimeChange}
        onMutationProbabilityChange={onMutationProbabilityChange}
        onLongLivingChampionsPercentageChange={onLongLivingChampionsPercentageChange}
        onPerformanceBoost={onPerformanceBoost}
        onReset={onReset}
      />
    </Block>
  );

  const lossHistoryChart = (
    <Block marginBottom="30px">
      <LossHistory
        history={lossHistory}
        avgHistory={avgLossHistory}
      />
    </Block>
  );

  const populationTable = (
    <Block>
      <PopulationTable
        cars={cars}
        carsInProgress={carsInProgress}
        carsLoss={
          generationIndex !== null && carsLoss[generationIndex]
            ? carsLoss[generationIndex]
            : {}
        }
      />
    </Block>
  );

  return (
    <>
      {timingDetails}
      {evolutionParams}
      <Block display="flex" flexDirection={['column', 'column', 'row-reverse']}>
        <Block flex={2} marginBottom="30px" marginLeft={['0px', '0px', '15px']}>
          {lossHistoryChart}
        </Block>
        <Block flex={1} marginBottom="30px" marginRight={['0px', '0px', '15px']}>
          {populationTable}
        </Block>
      </Block>
      <BestGenomes
        bestGenome={bestGenome}
        bestCarLicencePlate={bestCarLicencePlate}
        minLoss={minLoss}
        secondBestGenome={secondBestGenome}
        secondBestCarLicencePlate={secondBestCarLicencePlate}
        secondMinLoss={secondMinLoss}
      />
    </>
  );
}

export default EvolutionAnalytics;
