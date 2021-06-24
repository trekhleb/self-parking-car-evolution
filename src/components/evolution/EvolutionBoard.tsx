import React, { useEffect, useState } from 'react';
import { H6, Label3 } from 'baseui/typography';
import {Tag, VARIANT as TAG_VARIANT} from 'baseui/tag';
import { Block } from 'baseui/block';

import { createGeneration, Generation } from '../../lib/genetic';
import Worlds, { EVOLUTION_WORLD_KEY } from '../world/Worlds';
import EvolutionPlaybackButtons from './EvolutionPlaybackButtons';
import PopulationTable, { CarsInProgressType } from './PopulationTable';
import { CarsType, CarType } from '../world/types/car';
import { generateWorldVersion, generationToCars } from './utils/evolution';

const genomeLength = 10;
const generationSizes = [10, 20, 50, 100];
const carsBatchSizes = [1, 5, 10];

const second = 1000;
const generationLifetime = 10 * second;

function EvolutionBoard() {
  const [generationSize, setGenerationSize] = useState<number>(generationSizes[0]);
  const [generationIndex, setGenerationIndex] = useState<number | null>(null);
  const [generation, setGeneration] = useState<Generation>([]);

  const [cars, setCars] = useState<CarsType>({});
  const [carsBatch, setCarsBatch] = useState<CarType[]>([]);
  const [carsBatchSize, setCarsBatchSize] = useState<number>(carsBatchSizes[0]);
  const [carsBatchIndex, setCarsBatchIndex] = useState<number | null>(null);

  const [evolutionPaused, setEvolutionPaused] = useState<boolean>(true);
  const [activeWorldKey, setActiveWorldKey] = React.useState<string | number>(EVOLUTION_WORLD_KEY);

  const carsBatchesTotal: number = Math.ceil(Object.keys(cars).length / carsBatchSize);
  const carsInProgress: CarsInProgressType = carsBatch.reduce((cars: CarsInProgressType, car: CarType) => {
    cars[car.licencePlate] = true;
    return cars;
  }, {});

  const onWorldSwitch = (worldKey: React.Key): void => {
    setActiveWorldKey(worldKey);
    onEvolutionReset();
  };

  const onEvolutionStart = () => {
    setEvolutionPaused(false);
  };

  const onEvolutionPause = () => {
    setEvolutionPaused(true);
  };

  const onEvolutionReset = () => {
    setEvolutionPaused(false);
    setGenerationIndex(0);
  };

  // Start the evolution.
  useEffect(() => {
    setGenerationIndex(0);
  }, []);

  // Once generation index is changed we need to create (or mate) a new generation.
  useEffect(() => {
    if (generationIndex === null) {
      return;
    }
    if (generationIndex === 0) {
      // Create the very first generation.
      const generation: Generation = createGeneration({
        generationSize,
        genomeLength,
      });
      setGeneration(generation);
    } else {
      // Mate and mutate existing population.
      console.log('MATE + MUTATE');
    }
  }, [generationIndex]);

  // Once generation is changed we need to create cars.
  useEffect(() => {
    if (!generation || !generation.length) {
      return;
    }
    const cars = generationToCars(generation);
    setCars(cars);
    setCarsBatchIndex(0);
  }, [generation]);

  // Once the cars batch index is updated we need to generate a cars batch.
  useEffect(() => {
    if (carsBatchIndex === null || generationIndex === null) {
      return;
    }
    if (!cars || !Object.keys(cars).length) {
      return;
    }
    if (carsBatchIndex < carsBatchesTotal) {
      const batchStart = carsBatchSize * carsBatchIndex;
      const batchEnd = batchStart + carsBatchSize;
      const carsBatch: CarType[] = Object.values(cars).slice(batchStart, batchEnd);
      setCarsBatch(carsBatch);
    } else {
      // All batches are passed. We need to move to another generation.
      setGenerationIndex(generationIndex + 1);
    }
  }, [carsBatchIndex]);

  // Once the new cars batch is created we need to start generation timer.
  useEffect(() => {
    if (carsBatchIndex === null) {
      return;
    }
    if (!carsBatch || !carsBatch.length) {
      return;
    }
    setTimeout(() => {
      const nextBatchIndex = carsBatchIndex + 1;
      if (nextBatchIndex >= carsBatchesTotal) {
        setCarsBatch([]);
        return;
      }
      setCarsBatchIndex(nextBatchIndex);
    }, generationLifetime);
  }, [carsBatch]);

  const worlds = (
    <Block>
      <Worlds
        cars={carsBatch}
        activeWorldKey={activeWorldKey}
        onWorldSwitch={onWorldSwitch}
        version={generateWorldVersion(generationIndex, carsBatchIndex)}
      />
    </Block>
  );

  const evolutionButtons = (
    <Block marginBottom="20px">
      <EvolutionPlaybackButtons
        isPlaying={evolutionPaused}
        onStart={onEvolutionStart}
        onPause={onEvolutionPause}
        onReset={onEvolutionReset}
      />
    </Block>
  );

  const timingDetails = generationIndex !== null && carsBatchIndex !== null ? (
    <Block marginBottom="20px" display="flex" flexDirection="row">
      <Block marginRight="20px">
        <Label3>
          Generation: <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">{generationIndex + 1}</Tag>
        </Label3>
      </Block>
      <Block>
        <Label3>
          Batch: <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">{carsBatchIndex + 1}</Tag>
        </Label3>
      </Block>
    </Block>
  ) : null;

  const populationTable = (
    <Block marginTop="16px">
      <PopulationTable
        cars={cars}
        carsInProgress={carsInProgress}
      />
    </Block>
  );

  return (
    <Block>
      {worlds}
      <H6 $style={{marginTop: '20px', marginBottom: '20px'}}>
        Evolution Board
      </H6>
      {evolutionButtons}
      {timingDetails}
      {populationTable}
    </Block>
  );
}

export default EvolutionBoard;
