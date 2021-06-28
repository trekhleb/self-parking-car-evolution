import React, { useEffect, useRef, useState } from 'react';
import { H6, Label3 } from 'baseui/typography';
import {Tag, VARIANT as TAG_VARIANT} from 'baseui/tag';
import { Block } from 'baseui/block';

import { createGeneration, Generation } from '../../lib/genetic';
import Worlds, { EVOLUTION_WORLD_KEY } from '../world/Worlds';
import EvolutionPlaybackButtons from './EvolutionPlaybackButtons';
import PopulationTable, { CarsFitnessType, CarsInProgressType } from './PopulationTable';
import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';
import { generateWorldVersion, generationToCars, GENOME_LENGTH } from './utils/evolution';
import { setSearchParam } from '../../utils/url';
import { WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP } from './constants/url';
import { getWorldKeyFromUrl } from './utils/url';
import Timer from './Timer';

const generationSizes = [10, 20, 50, 100];
const carsBatchSizes = [1, 5, 10];

const second = 1000;
const generationLifetime = 15 * second;

function EvolutionBoard() {
  const [generationSize, setGenerationSize] = useState<number>(generationSizes[0]);
  const [generationIndex, setGenerationIndex] = useState<number | null>(null);
  const [generation, setGeneration] = useState<Generation>([]);

  const [cars, setCars] = useState<CarsType>({});
  const [carsBatch, setCarsBatch] = useState<CarType[]>([]);
  const [carsBatchSize, setCarsBatchSize] = useState<number>(carsBatchSizes[0]);
  const [carsBatchIndex, setCarsBatchIndex] = useState<number | null>(null);

  const [evolutionPaused, setEvolutionPaused] = useState<boolean>(true);
  const [activeWorldKey, setActiveWorldKey] = React.useState<string | number>(getWorldKeyFromUrl(EVOLUTION_WORLD_KEY));

  const batchTimer = useRef<NodeJS.Timeout | null>(null);

  const carsFitnessRef = useRef<CarsFitnessType>({});
  const [carsFitness, setCarsFitness] = useState<CarsFitnessType>({});

  const carsBatchesTotal: number = Math.ceil(Object.keys(cars).length / carsBatchSize);
  const carsInProgress: CarsInProgressType = carsBatch.reduce((cars: CarsInProgressType, car: CarType) => {
    cars[car.licencePlate] = true;
    return cars;
  }, {});

  const onWorldSwitch = (worldKey: React.Key): void => {
    setActiveWorldKey(worldKey);
    setSearchParam(WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP[worldKey]);
    if (worldKey === EVOLUTION_WORLD_KEY) {
      setGenerationIndex(0);
    } else {
      onEvolutionReset();
    }
  };

  const onEvolutionStart = () => {
    setEvolutionPaused(false);
  };

  const onEvolutionPause = () => {
    setEvolutionPaused(true);
  };

  const onEvolutionReset = () => {
    cancelBatchTimer();
    setGenerationIndex(null);
    setCarsBatchIndex(null);
    setGeneration([]);
    setCarsBatch([]);
    setCars({});
  };

  const onCarFitnessUpdate = (licensePlate: CarLicencePlateType, fitness: number) => {
    const fitnessValues = {...carsFitnessRef.current};
    fitnessValues[licensePlate] = fitness;
    carsFitnessRef.current = fitnessValues;
    setCarsFitness(fitnessValues);
  };

  const cancelBatchTimer = () => {
    if (batchTimer.current === null) {
      return;
    }
    clearTimeout(batchTimer.current);
    batchTimer.current = null;
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
        genomeLength: GENOME_LENGTH,
      });
      setGeneration(generation);
    } else {
      // Mate and mutate existing population.
      // @TODO: Mate and mutate.
      const newGeneration = [...generation];
      setGeneration(newGeneration);
    }
  }, [generationIndex]);

  // Once generation is changed we need to create cars.
  useEffect(() => {
    if (!generation || !generation.length) {
      return;
    }
    const cars = generationToCars(generation, onCarFitnessUpdate);
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
    if (carsBatchIndex >= carsBatchesTotal) {
      return;
    }
    const batchStart = carsBatchSize * carsBatchIndex;
    const batchEnd = batchStart + carsBatchSize;
    const carsBatch: CarType[] = Object.values(cars).slice(batchStart, batchEnd);
    setCarsBatch(carsBatch);
  }, [carsBatchIndex]);

  // Once the new cars batch is created we need to start generation timer.
  useEffect(() => {
    if (carsBatchIndex === null) {
      return;
    }
    if (!carsBatch || !carsBatch.length) {
      return;
    }
    cancelBatchTimer();
    batchTimer.current = setTimeout(() => {
      const nextBatchIndex = carsBatchIndex + 1;
      if (nextBatchIndex >= carsBatchesTotal) {
        setCarsBatch([]);
        if (generationIndex !== null) {
          setCarsBatchIndex(null);
          setGenerationIndex(generationIndex + 1);
        }
        return;
      }
      setCarsBatchIndex(nextBatchIndex);
    }, generationLifetime);
  }, [carsBatch]);

  const batchVersion = generateWorldVersion(generationIndex, carsBatchIndex);

  const worlds = (
    <Block>
      <Worlds
        cars={carsBatch}
        activeWorldKey={activeWorldKey}
        onWorldSwitch={onWorldSwitch}
        version={batchVersion}
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
    <Block marginBottom="20px" display="flex" flexDirection="row" alignItems="center">
      <Block marginRight="20px">
        <Label3>
          Generation:
          <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
            <small>#</small>{generationIndex + 1}
          </Tag>
        </Label3>
      </Block>
      <Block marginRight="20px">
        <Label3>
          Group:
          <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
            <small>#</small>{carsBatchIndex + 1}
          </Tag>
        </Label3>
      </Block>
      <Block marginRight="20px">
        <Label3>
          <Timer timout={generationLifetime} version={batchVersion} />
        </Label3>
      </Block>
    </Block>
  ) : null;

  const populationTable = (
    <Block marginTop="16px">
      <PopulationTable
        cars={cars}
        carsInProgress={carsInProgress}
        carsFitness={carsFitness}
      />
    </Block>
  );

  const evolutionAnalytics = activeWorldKey === EVOLUTION_WORLD_KEY ? (
    <>
      <H6 $style={{marginTop: '20px', marginBottom: '20px'}}>
        Evolution Board
      </H6>
      {evolutionButtons}
      {timingDetails}
      {populationTable}
    </>
  ) : null;

  return (
    <Block>
      {worlds}
      {evolutionAnalytics}
    </Block>
  );
}

export default EvolutionBoard;
