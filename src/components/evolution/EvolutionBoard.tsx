import React, { useEffect, useRef, useState } from 'react';
import { Block } from 'baseui/block';
import _ from 'lodash';

import { createGeneration, Generation, Genome, select } from '../../lib/genetic';
import Worlds, { EVOLUTION_WORLD_KEY } from '../world/Worlds';
import PopulationTable, { CarsLossType, CarsInProgressType } from './PopulationTable';
import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';
import EvolutionBoardParams, {
  DEFAULT_BATCH_SIZE,
  DEFAULT_GENERATION_LIFETIME,
  DEFAULT_GENERATION_SIZE,
  SECOND
} from './EvolutionBoardParams';
import EvolutionTiming from './EvolutionTiming';
import LossHistory from './LossHistory';
import BestGenomes from './BestGenomes';
import { carLossToFitness, GENOME_LENGTH } from '../../lib/carGenetic';
import { getWorldKeyFromUrl } from './utils/url';
import { generationToCars } from './utils/evolution';
import { getIntSearchParam, setSearchParam } from '../../utils/url';
import { WORLD_SEARCH_PARAM, WORLD_TAB_INDEX_TO_NAME_MAP } from './constants/url';

const GENERATION_SIZE_URL_PARAM = 'generation-size';
const GROUP_SIZE_URL_PARAM = 'group-size';
const GENERATION_LIFETIME_URL_PARAM = 'generation-lifetime';

//  Genome array, concatenated to a string (i.e. '1010011')
type GenomeKey = string;

type GenomeLossType = Record<GenomeKey, number | null>;

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

  const [bestGenome, setBestGenome] = useState<Genome | null>(null);
  const [minLoss, setMinLoss] = useState<number | null>(null);
  const [bestCarLicencePlate, setBestCarLicencePlate] = useState<CarLicencePlateType | null>(null);
  const [secondBestGenome, setSecondBestGenome] = useState<Genome | null>(null);
  const [secondMinLoss, setSecondMinLoss] = useState<number | null>(null);
  const [secondBestCarLicencePlate, setSecondBestCarLicencePlate] = useState<CarLicencePlateType | null>(null);

  const batchTimer = useRef<NodeJS.Timeout | null>(null);

  const carsLossRef = useRef<CarsLossType[]>([{}]);
  const [carsLoss, setCarsLoss] = useState<CarsLossType[]>([{}]);
  const [lossHistory, setLossHistory
  ] = useState<number[]>([]);

  const genomeLossRef = useRef<GenomeLossType[]>([{}]);

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

    if (!carsLossRef.current[generationIndex]) {
      carsLossRef.current[generationIndex] = {};
    }
    carsLossRef.current[generationIndex][licensePlate] = loss;

    if (!genomeLossRef.current[generationIndex]) {
      genomeLossRef.current[generationIndex] = {};
    }
    if (!carsRef.current[licensePlate]) {
      throw new Error(`Cannot fetch genome index for a car with the licence plate ${licensePlate}`);
    }
    const carGenome: Genome = generation[carsRef.current[licensePlate].genomeIndex];
    genomeLossRef.current[generationIndex][carGenome.join('')] = loss;
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
    if (batchTimer.current === null) {
      return;
    }
    clearTimeout(batchTimer.current);
    batchTimer.current = null;
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
      throw new Error('Fitness value is undefined');
    }
    const loss = genomeLossRef.current[generationIndex][genomeKey];
    if (typeof loss !== 'number') {
      throw new Error('Loss value is not a number');
    }
    return carLossToFitness(loss);
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
      setBestGenome(generation[0]);
      setSecondBestGenome(generation[1]);
    } else {
      // Mate and mutate existing population.
      const newGeneration = select(generation, carFitnessFunction(generationIndex - 1));
      setGeneration(newGeneration);
    }
  }, [generationIndex, worldIndex]);

  // Once generation is changed we need to create cars.
  useEffect(() => {
    if (!generation || !generation.length) {
      return;
    }
    const cars = generationToCars({
      generation,
      generationIndex,
      onLossUpdate: onCarLossUpdate,
    });
    setCars(cars);
    setCarsBatchIndex(0);
    carsRef.current = _.cloneDeep(cars);
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
    <Block marginBottom="30px" marginTop="30px">
      <EvolutionTiming
        generationIndex={generationIndex}
        batchIndex={carsBatchIndex}
        batchVersion={batchVersion}
        worldVersion={`${worldIndex}`}
        generationLifetimeMs={generationLifetimeMs}
      />
    </Block>
  );

  const evolutionParams = (
    <Block marginBottom="30px">
      <EvolutionBoardParams
        generationSize={generationSize}
        batchSize={carsBatchSize}
        generationLifetime={generationLifetime}
        onGenerationSizeChange={onGenerationSizeChange}
        onBatchSizeChange={onBatchSizeChange}
        onGenerationLifetimeChange={onGenerationLifetimeChange}
      />
    </Block>
  );

  const lossHistoryChart = (
    <Block marginBottom="30px">
      <LossHistory history={lossHistory} />
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

  const evolutionAnalytics = activeWorldKey === EVOLUTION_WORLD_KEY ? (
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
  ) : null;

  return (
    <Block>
      {worlds}
      {evolutionAnalytics}
    </Block>
  );
}

const generateWorldVersion = (
  generationIndex: number | null,
  batchIndex: number | null
): string => {
  const generation = generationIndex === null ? -1 : generationIndex;
  const batch = batchIndex === null ? -1: batchIndex;
  return `world-${generation}-${batch}`;
};

export default EvolutionBoard;
