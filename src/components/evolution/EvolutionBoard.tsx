import React, { useEffect, useRef, useState } from 'react';
import { Block } from 'baseui/block';
import _ from 'lodash';

import { createGeneration, Generation, Genome, select } from '../../lib/genetic';
import Worlds, { AUTOMATIC_PARKING_WORLD_KEY, EVOLUTION_WORLD_KEY } from '../world/Worlds';
import { CarsLossType, CarsInProgressType } from './PopulationTable';
import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';
import {
  DEFAULT_BATCH_SIZE,
  DEFAULT_GENERATION_LIFETIME,
  DEFAULT_GENERATION_SIZE,
  SECOND,
  TRAINED_CAR_GENERATION_LIFETIME
} from './EvolutionBoardParams';
import { carLossToFitness, GENOME_LENGTH } from '../../lib/carGenetic';
import { getWorldKeyFromUrl } from './utils/url';
import { generateWorldVersion, generationToCars } from './utils/evolution';
import { getIntSearchParam, setSearchParam } from '../../utils/url';
import { WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP } from './constants/url';
import EvolutionAnalytics from './EvolutionAnalytics';
import { loggerBuilder } from '../../utils/logger';
import { FIRST_BEST_GENOME } from './constants/genomes';
import AutomaticParkingAnalytics from './AutomaticParkingAnalytics';

const GENERATION_SIZE_URL_PARAM = 'generation-size';
const GROUP_SIZE_URL_PARAM = 'group-size';
const GENERATION_LIFETIME_URL_PARAM = 'generation-lifetime';

const bestDefaultTrainedGeneration: Generation = [
  FIRST_BEST_GENOME,
];

//  Genome array, concatenated to a string (i.e. '1010011')
type GenomeKey = string;

type GenomeLossType = Record<GenomeKey, number | null>;

// @TODO: Component is too big. Split it!
// Separation of concerns are ignored for the faster proof-of-concept development.
function EvolutionBoard() {
  const [activeWorldKey, setActiveWorldKey] = React.useState<string | number>(getWorldKeyFromUrl(EVOLUTION_WORLD_KEY));
  const [worldIndex, setWorldIndex] = useState<number>(0);

  const [generationSize, setGenerationSize] = useState<number>(
    getIntSearchParam(GENERATION_SIZE_URL_PARAM, DEFAULT_GENERATION_SIZE)
  );
  const [generationIndex, setGenerationIndex] = useState<number | null>(null);
  const [generation, setGeneration] = useState<Generation>([]);
  const [generationLifetime, setGenerationLifetime] = useState<number>(
    getIntSearchParam(GENERATION_LIFETIME_URL_PARAM, DEFAULT_GENERATION_LIFETIME)
  );

  const [cars, setCars] = useState<CarsType>({});
  const [carsBatch, setCarsBatch] = useState<CarType[]>([]);
  const [carsBatchSize, setCarsBatchSize] = useState<number>(
    getIntSearchParam(GROUP_SIZE_URL_PARAM, DEFAULT_BATCH_SIZE)
  );
  const [carsBatchIndex, setCarsBatchIndex] = useState<number | null>(null);
  const carsRef = useRef<CarsType>({});

  const bestTrainedCarLossRef = useRef<number | null>(null);
  const onTrainedCarLossUpdate = (licensePlate: CarLicencePlateType, loss: number) => {
    bestTrainedCarLossRef.current = loss;
  };

  const [bestTrainedCarLoss, setBestTrainedCarLoss] = useState<number | null>(null);
  const [bestTrainedCarCycleIndex, setBestTrainedCarCycleIndex] = useState<number>(0);
  const [bestTrainedGeneration] = useState<Generation>(bestDefaultTrainedGeneration);
  const [bestTrainedCars] = useState<CarType[]>(
    Object.values(
      generationToCars({
        generation: bestDefaultTrainedGeneration,
        generationIndex: 0,
        onLossUpdate: onTrainedCarLossUpdate,
      })
    )
  );

  const [bestGenome, setBestGenome] = useState<Genome | null>(null);
  const [minLoss, setMinLoss] = useState<number | null>(null);
  const [bestCarLicencePlate, setBestCarLicencePlate] = useState<CarLicencePlateType | null>(null);
  const [secondBestGenome, setSecondBestGenome] = useState<Genome | null>(null);
  const [secondMinLoss, setSecondMinLoss] = useState<number | null>(null);
  const [secondBestCarLicencePlate, setSecondBestCarLicencePlate] = useState<CarLicencePlateType | null>(null);

  const batchTimer = useRef<NodeJS.Timeout | null>(null);
  const automaticParkingLifetimeTimer = useRef<NodeJS.Timeout | null>(null);

  const carsLossRef = useRef<CarsLossType[]>([{}]);
  const [carsLoss, setCarsLoss] = useState<CarsLossType[]>([{}]);
  const [lossHistory, setLossHistory
  ] = useState<number[]>([]);
  const genomeLossRef = useRef<GenomeLossType[]>([{}]);

  const logger = loggerBuilder({ context: 'EvolutionBoard' });
  const carsBatchesTotal: number = Math.ceil(Object.keys(cars).length / carsBatchSize);
  const carsInProgress: CarsInProgressType = carsBatch.reduce((cars: CarsInProgressType, car: CarType) => {
    cars[car.licencePlate] = true;
    return cars;
  }, {});
  const batchVersion = generateWorldVersion(generationIndex, carsBatchIndex);
  const generationLifetimeMs = generationLifetime * SECOND;
  const automaticParkingCycleLifetimeMs = TRAINED_CAR_GENERATION_LIFETIME * SECOND;
  const automaticWorldVersion = `automatic-${bestTrainedCarCycleIndex}`;

  const isEvolutionWorld = activeWorldKey === EVOLUTION_WORLD_KEY;
  const isAutomaticParkingWorld = activeWorldKey === AUTOMATIC_PARKING_WORLD_KEY;

  const onWorldSwitch = (worldKey: React.Key): void => {
    logger.info(`World has switched to ${worldKey}`);

    setActiveWorldKey(worldKey);
    setSearchParam(WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP[worldKey]);

    if (worldKey === EVOLUTION_WORLD_KEY) {
      setGenerationIndex(0);
    } else {
      onEvolutionReset();
    }

    if (worldKey === AUTOMATIC_PARKING_WORLD_KEY) {
      setBestTrainedCarCycleIndex(bestTrainedCarCycleIndex + 1);
    } else {
      onAutomaticParkingReset();
    }
  };

  const onCommonStateReset = () => {
    setGeneration([]);
    setCarsBatch([]);
    setCars({});
    setCarsLoss([{}]);
    carsRef.current = {};
    carsLossRef.current = [{}];
    genomeLossRef.current = [{}];
    setLossHistory([]);
    setBestGenome(null);
    setMinLoss(null);
    setBestCarLicencePlate(null);
    setSecondBestGenome(null);
    setSecondMinLoss(null);
    setSecondBestCarLicencePlate(null);
  };

  const onAutomaticParkingReset = () => {
    cancelAutomaticCycleTimer();
    setBestTrainedCarCycleIndex(0);
    setBestTrainedCarLoss(null);
  };

  const onEvolutionReset = () => {
    cancelBatchTimer();
    onCommonStateReset();
    setWorldIndex(0);
    setGenerationIndex(null);
    setCarsBatchIndex(null);
  };

  const onEvolutionRestart = () => {
    cancelBatchTimer();
    onCommonStateReset();
    setWorldIndex(worldIndex + 1);
    setGenerationIndex(0);
    setCarsBatchIndex(null);
  };

  const onCarLossUpdate = (licensePlate: CarLicencePlateType, loss: number) => {
    if (generationIndex === null) {
      return;
    }

    // Save the car loss to the "LicencePlate → Loss" map.
    if (!carsLossRef.current[generationIndex]) {
      carsLossRef.current[generationIndex] = {};
    }
    carsLossRef.current[generationIndex][licensePlate] = loss;

    // Save the car loss to the "GenomeKey → Loss" map.
    if (!genomeLossRef.current[generationIndex]) {
      genomeLossRef.current[generationIndex] = {};
    }
    if (carsRef.current[licensePlate]) {
      const carGenomeIndex = carsRef.current[licensePlate].genomeIndex;
      const carGenome: Genome = generation[carGenomeIndex];
      const carGenomeKey: GenomeKey = carGenome.join('');
      genomeLossRef.current[generationIndex][carGenomeKey] = loss;
    }
  };

  const onGenerationSizeChange = (size: number) => {
    setGenerationSize(size);
    setSearchParam(GENERATION_SIZE_URL_PARAM, `${size}`);
    onEvolutionRestart();
  };

  const onBatchSizeChange = (size: number) => {
    setCarsBatchSize(size);
    setSearchParam(GROUP_SIZE_URL_PARAM, `${size}`);
    onEvolutionRestart();
  };

  const onGenerationLifetimeChange = (time: number) => {
    setGenerationLifetime(time);
    setSearchParam(GENERATION_LIFETIME_URL_PARAM, `${time}`);
  };

  const cancelBatchTimer = () => {
    logger.info('Trying to cancel batch timer');
    if (batchTimer.current === null) {
      return;
    }
    clearTimeout(batchTimer.current);
    batchTimer.current = null;
  };

  const onAutomaticCycleLifetimeEnd = () => {
    logger.info(`Automatic cycle #${bestTrainedCarCycleIndex} lifetime ended`);
    setBestTrainedCarLoss(bestTrainedCarLossRef.current);
    setBestTrainedCarCycleIndex(bestTrainedCarCycleIndex + 1);
  };

  const cancelAutomaticCycleTimer = () => {
    logger.info('Trying to cancel automatic parking cycle timer');
    if (automaticParkingLifetimeTimer.current === null) {
      return;
    }
    clearTimeout(automaticParkingLifetimeTimer.current);
    automaticParkingLifetimeTimer.current = null;
  };

  const countDownAutomaticParkingCycleLifetime = (onLifetimeEnd: () => void) => {
    logger.info(`Automatic parking cycle started`);
    cancelAutomaticCycleTimer();
    automaticParkingLifetimeTimer.current = setTimeout(onLifetimeEnd, automaticParkingCycleLifetimeMs);
  };

  const syncBestGenome = (): string | null | undefined => {
    if (generationIndex === null) {
      return;
    }

    const generationLoss: CarsLossType = carsLossRef.current[generationIndex];
    if (!generationLoss) {
      return;
    }

    let bestCarLicensePlate: CarLicencePlateType | null = null;
    let minLoss: number = Infinity;
    let bestGenomeIndex: number = -1;

    Object.keys(generationLoss).forEach((licencePlate: CarLicencePlateType) => {
      const carLoss: number | null = generationLoss[licencePlate];
      if (carLoss === null) {
        return;
      }
      if (carLoss < minLoss) {
        minLoss = carLoss;
        bestCarLicensePlate = licencePlate;
        bestGenomeIndex = cars[licencePlate].genomeIndex;
      }
    });

    if (bestGenomeIndex === -1) {
      return;
    }

    setMinLoss(minLoss);
    setBestGenome(generation[bestGenomeIndex]);
    setBestCarLicencePlate(bestCarLicensePlate);

    return bestCarLicensePlate;
  };

  const syncSecondBestGenome = (
    bestLicensePlateSoFar: string | null | undefined
  ): string | null | undefined => {
    if (generationIndex === null || !bestLicensePlateSoFar) {
      return;
    }

    const generationLoss: CarsLossType = carsLossRef.current[generationIndex];
    if (!generationLoss) {
      return;
    }

    let secondBestCarLicensePlate: CarLicencePlateType | null = null;
    let secondMinLoss: number = Infinity;
    let secondBestGenomeIndex: number = -1;

    Object.keys(generationLoss).forEach((licencePlate: CarLicencePlateType) => {
      // Skipping the best car genome.
      if (licencePlate === bestLicensePlateSoFar) {
        return;
      }
      const carLoss: number | null = generationLoss[licencePlate];
      if (carLoss === null) {
        return;
      }
      if (carLoss < secondMinLoss) {
        secondMinLoss = carLoss;
        secondBestCarLicensePlate = licencePlate;
        secondBestGenomeIndex = cars[licencePlate].genomeIndex;
      }
    });

    if (secondBestGenomeIndex === -1) {
      return;
    }

    setSecondMinLoss(secondMinLoss);
    setSecondBestGenome(generation[secondBestGenomeIndex]);
    setSecondBestCarLicencePlate(secondBestCarLicensePlate);

    return secondBestCarLicensePlate;
  };

  const syncLossHistory = () => {
    if (generationIndex === null) {
      return;
    }
    const generationLoss: CarsLossType = carsLossRef.current[generationIndex];
    const newLossHistory = [...lossHistory];
    if (generationLoss) {
      newLossHistory[generationIndex] = Object.values(generationLoss).reduce(
        (minVal: number, currVal: number | null) => {
          if (currVal === null) {
            return minVal;
          }
          return Math.min(minVal, currVal);
        },
        Infinity
      );
    } else {
      newLossHistory[generationIndex] = Infinity;
    }
    setLossHistory(newLossHistory);
  };

  const carFitnessFunction = (generationIndex: number) => (genome: Genome): number => {
    const genomeKey = genome.join('');
    if (
      generationIndex === null ||
      !genomeLossRef.current[generationIndex] ||
      typeof genomeLossRef.current[generationIndex][genomeKey] !== 'number'
    ) {
      throw new Error('Fitness value for specified genome is undefined');
    }
    const loss = genomeLossRef.current[generationIndex][genomeKey];
    if (typeof loss !== 'number') {
      throw new Error('Loss value is not a number');
    }
    return carLossToFitness(loss);
  };

  const startEvolution = () => {
    logger.info('Start evolution');
    setGenerationIndex(0);
  };

  const createFirstGeneration = () => {
    if (generationIndex === null) {
      return;
    }
    logger.info('Create first generation');
    const generation: Generation = createGeneration({
      generationSize,
      genomeLength: GENOME_LENGTH,
    });
    setGeneration(generation);
    setBestGenome(generation[0]);
    setSecondBestGenome(generation[1]);
  };

  const mateExistingGeneration = () => {
    if (generationIndex === null) {
      return;
    }
    logger.info(`Mate generation #${generationIndex}`);
    try {
      const newGeneration = select(generation, carFitnessFunction(generationIndex - 1));
      setGeneration(newGeneration);
    } catch (e) {
      // If selection failed for some reason, clone the existing generation and try again.
      setGeneration([...generation]);
      const errorMessage = 'The selection for the new generation has failed. Cloning the existing generation to try it next time.';
      const exceptionMessage = e && e.message ? e.message : '';
      logger.warn(errorMessage, exceptionMessage);
    }
  };

  const createCarsFromGeneration = () => {
    if (!generation || !generation.length) {
      return;
    }
    logger.info(`Create cars from generation #${generationIndex}`);
    const cars = generationToCars({
      generation,
      generationIndex,
      onLossUpdate: onCarLossUpdate,
    });
    setCars(cars);
    setCarsBatchIndex(0);
    carsRef.current = _.cloneDeep(cars);
  };

  const generateNextCarsBatch = () => {
    if (carsBatchIndex === null || generationIndex === null) {
      return;
    }
    if (!cars || !Object.keys(cars).length) {
      return;
    }
    if (carsBatchIndex >= carsBatchesTotal) {
      return;
    }
    logger.info(`Generate cars batch #${carsBatchIndex}`);
    const batchStart = carsBatchSize * carsBatchIndex;
    const batchEnd = batchStart + carsBatchSize;
    const carsBatch: CarType[] = Object.values(cars).slice(batchStart, batchEnd);
    setCarsBatch(carsBatch);
  };

  const onBatchLifetimeEnd = () => {
    if (carsBatchIndex === null) {
      return;
    }
    logger.info(`Batch #${carsBatchIndex} lifetime ended`);
    setCarsLoss(_.cloneDeep<CarsLossType[]>(carsLossRef.current));
    syncLossHistory();
    const bestLicensePlate = syncBestGenome();
    syncSecondBestGenome(bestLicensePlate);
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
  };

  const countDownBatchLifetime = (onLifetimeEnd: () => void) => {
    if (carsBatchIndex === null) {
      return;
    }
    if (!carsBatch || !carsBatch.length) {
      return;
    }
    logger.info(`Batch #${carsBatchIndex} lifetime started`);
    cancelBatchTimer();
    batchTimer.current = setTimeout(onLifetimeEnd, generationLifetimeMs);
  };


  // Start the automatic parking cycles.
  useEffect(() => {
    if (!isAutomaticParkingWorld) {
      return;
    }
    countDownAutomaticParkingCycleLifetime(onAutomaticCycleLifetimeEnd);
    return () => {
      cancelAutomaticCycleTimer();
    };
  }, [
    bestTrainedCarCycleIndex,
  ]);

  // Start the evolution.
  useEffect(() => {
    if (!isEvolutionWorld) {
      return;
    }
    startEvolution();
  }, []);

  // Once generation index is changed we need to create (or mate) a new generation.
  useEffect(() => {
    if (generationIndex === 0) {
      createFirstGeneration();
    } else {
      mateExistingGeneration();
    }
  }, [generationIndex, worldIndex]);

  // Once generation is changed we need to create cars.
  useEffect(() => {
    createCarsFromGeneration();
  }, [generation]);

  // Once the cars batch index is updated we need to generate a cars batch.
  useEffect(() => {
    generateNextCarsBatch();
  }, [carsBatchIndex]);

  // Once the new cars batch is created we need to start generation timer.
  useEffect(() => {
    countDownBatchLifetime(onBatchLifetimeEnd);
    return () => {
      cancelBatchTimer();
    };
  }, [carsBatch]);

  const worlds = (
    <Block>
      <Worlds
        cars={carsBatch}
        bestCars={bestTrainedCars}
        activeWorldKey={activeWorldKey}
        onWorldSwitch={onWorldSwitch}
        evolutionWorldVersion={batchVersion}
        automaticWorldVersion={automaticWorldVersion}
      />
    </Block>
  );

  const evolutionAnalytics = isEvolutionWorld ? (
    <EvolutionAnalytics
      generationIndex={generationIndex}
      carsBatchIndex={carsBatchIndex}
      worldIndex={worldIndex}
      generationLifetimeMs={generationLifetimeMs}
      generationSize={generationSize}
      carsBatchSize={carsBatchSize}
      generationLifetime={generationLifetime}
      batchVersion={batchVersion}
      onGenerationSizeChange={onGenerationSizeChange}
      onBatchSizeChange={onBatchSizeChange}
      onGenerationLifetimeChange={onGenerationLifetimeChange}
      lossHistory={lossHistory}
      cars={cars}
      carsInProgress={carsInProgress}
      carsLoss={carsLoss}
      bestGenome={bestGenome}
      bestCarLicencePlate={bestCarLicencePlate}
      minLoss={minLoss}
      secondBestGenome={secondBestGenome}
      secondBestCarLicencePlate={secondBestCarLicencePlate}
      secondMinLoss={secondMinLoss}
    />
  ) : null;

  const automaticParkingAnalytics = isAutomaticParkingWorld ? (
    <AutomaticParkingAnalytics
      bestGenome={bestTrainedGeneration[0]}
      minLoss={bestTrainedCarLoss}
      generationLifetimeMs={automaticParkingCycleLifetimeMs}
      batchVersion={automaticWorldVersion}
      carsBatchIndex={bestTrainedCarCycleIndex}
    />
  ) : null;

  return (
    <Block>
      {worlds}
      {evolutionAnalytics}
      {automaticParkingAnalytics}
    </Block>
  );
}

export default EvolutionBoard;
