import React, { useEffect, useRef, useState } from 'react';
import { Block } from 'baseui/block';

import { createGeneration, Generation } from '../../lib/genetic';
import Worlds, { EVOLUTION_WORLD_KEY } from '../world/Worlds';
import PopulationTable, { CarsFitnessType, CarsInProgressType } from './PopulationTable';
import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';
import { generateWorldVersion, generationToCars, GENOME_LENGTH } from './utils/evolution';
import { setSearchParam } from '../../utils/url';
import { WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP } from './constants/url';
import { getWorldKeyFromUrl } from './utils/url';
import EvolutionBoardParams, {
  DEFAULT_BATCH_SIZE,
  DEFAULT_GENERATION_LIFETIME,
  DEFAULT_GENERATION_SIZE,
  SECOND
} from './EvolutionBoardParams';
import EvolutionTiming from './EvolutionTiming';

function EvolutionBoard() {
  const [worldIndex, setWorldIndex] = useState<number>(0);

  const [generationSize, setGenerationSize] = useState<number>(DEFAULT_GENERATION_SIZE);
  const [generationIndex, setGenerationIndex] = useState<number | null>(null);
  const [generation, setGeneration] = useState<Generation>([]);
  const [generationLifetime, setGenerationLifetime] = useState<number>(DEFAULT_GENERATION_LIFETIME);

  const [cars, setCars] = useState<CarsType>({});
  const [carsBatch, setCarsBatch] = useState<CarType[]>([]);
  const [carsBatchSize, setCarsBatchSize] = useState<number>(DEFAULT_BATCH_SIZE);
  const [carsBatchIndex, setCarsBatchIndex] = useState<number | null>(null);

  const [activeWorldKey, setActiveWorldKey] = React.useState<string | number>(getWorldKeyFromUrl(EVOLUTION_WORLD_KEY));

  const batchTimer = useRef<NodeJS.Timeout | null>(null);

  const carsFitnessRef = useRef<CarsFitnessType>({});
  const [carsFitness, setCarsFitness] = useState<CarsFitnessType>({});

  const carsBatchesTotal: number = Math.ceil(Object.keys(cars).length / carsBatchSize);
  const carsInProgress: CarsInProgressType = carsBatch.reduce((cars: CarsInProgressType, car: CarType) => {
    cars[car.licencePlate] = true;
    return cars;
  }, {});

  const generationLifetimeMs = generationLifetime * SECOND;

  const onWorldSwitch = (worldKey: React.Key): void => {
    setActiveWorldKey(worldKey);
    setSearchParam(WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP[worldKey]);
    if (worldKey === EVOLUTION_WORLD_KEY) {
      setGenerationIndex(0);
    } else {
      onEvolutionReset();
    }
  };

  const onEvolutionReset = () => {
    cancelBatchTimer();
    setGenerationIndex(null);
    setCarsBatchIndex(null);
    setGeneration([]);
    setCarsBatch([]);
    setCars({});
  };

  const onEvolutionRestart = () => {
    cancelBatchTimer();
    setGeneration([]);
    setCarsBatch([]);
    setCars({});
    setCarsBatchIndex(null);
    setWorldIndex(worldIndex + 1);
    setGenerationIndex(0);
  };

  const onCarFitnessUpdate = (licensePlate: CarLicencePlateType, fitness: number) => {
    const fitnessValues = {...carsFitnessRef.current};
    fitnessValues[licensePlate] = fitness;
    carsFitnessRef.current = fitnessValues;
  };

  const onGenerationSizeChange = (size: number) => {
    setGenerationSize(size);
    onEvolutionRestart();
  };

  const onBatchSizeChange = (size: number) => {
    setCarsBatchSize(size);
    onEvolutionRestart();
  };

  const onGenerationLifetimeChange = (time: number) => {
    setGenerationLifetime(time);
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
  }, [generationIndex, worldIndex]);

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
      setCarsFitness({...carsFitnessRef.current});
      setCarsBatchIndex(nextBatchIndex);
    }, generationLifetimeMs);
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

  const timingDetails = (
    <EvolutionTiming
      generationIndex={generationIndex}
      batchIndex={carsBatchIndex}
      batchVersion={batchVersion}
      worldVersion={`${worldIndex}`}
      generationLifetimeMs={generationLifetimeMs}
    />
  );

  const evolutionParams = (
    <EvolutionBoardParams
      generationSize={generationSize}
      batchSize={carsBatchSize}
      generationLifetime={generationLifetime}
      onGenerationSizeChange={onGenerationSizeChange}
      onBatchSizeChange={onBatchSizeChange}
      onGenerationLifetimeChange={onGenerationLifetimeChange}
    />
  );

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
      {timingDetails}
      {evolutionParams}
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
