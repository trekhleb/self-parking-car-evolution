import React, { useEffect, useRef, useState } from 'react';
import { Block } from 'baseui/block';
import { useSnackbar, DURATION } from 'baseui/snackbar';
import { Check } from 'baseui/icon';
import { Notification } from 'baseui/notification';

import { Generation, Genome } from '../../libs/genetic';
import { CarLicencePlateType, CarType } from '../world/types/car';
import {
  SECOND,
  TRAINED_CAR_GENERATION_LIFETIME
} from './EvolutionBoardParams';
import { generationToCars } from './utils/evolution';
import { loggerBuilder } from '../../utils/logger';
import { BEST_GENOMES } from './constants/genomes';
import AutomaticParkingAnalytics from './AutomaticParkingAnalytics';
import World from '../world/World';
import ParkingAutomatic from '../world/parkings/ParkingAutomatic';
import { DynamicCarsPosition, DYNAMIC_CARS_POSITION_MIDDLE } from '../world/constants/cars';
import { DYNAMIC_CARS_POSITION_FRONT } from '../world/constants/cars';
import { getIntSearchParam, getStringSearchParam, setSearchParam } from '../../utils/url';

const defaultGenomeIndex = 0;

const GENOME_IDX_URL_PARAM = 'genome_idx';
const START_POSITION_URL_PARAM = 'position';
const DEFAULT_START_POSITION = DYNAMIC_CARS_POSITION_FRONT;

function EvolutionTabAutomatic() {
  const {enqueue} = useSnackbar();

  const bestTrainedCarLossRef = useRef<number | null>(null);
  const onTrainedCarLossUpdate = (licensePlate: CarLicencePlateType, loss: number) => {
    bestTrainedCarLossRef.current = loss;
  };

  const [performanceBoost, setPerformanceBoost] = useState<boolean>(false);

  const [selectedGenomeIndex, setSelectedGenomeIndex] = useState<number>(
    getIntSearchParam(GENOME_IDX_URL_PARAM, defaultGenomeIndex)
  );

  const [dynamicCarsPosition, setDynamicCarsPosition] = useState<DynamicCarsPosition>(getCarsPositionFromURL());

  const bestDefaultTrainedGeneration: Generation = [
    BEST_GENOMES[dynamicCarsPosition][defaultGenomeIndex],
  ];

  const [bestTrainedCarLoss, setBestTrainedCarLoss] = useState<number | null>(null);
  const [bestTrainedCarCycleIndex, setBestTrainedCarCycleIndex] = useState<number>(0);
  const [bestTrainedGeneration, setBestTrainedGeneration] = useState<Generation>(bestDefaultTrainedGeneration);
  const [bestTrainedCars, setBestTrainedCars] = useState<CarType[]>(
    Object.values(
      generationToCars({
        generation: bestDefaultTrainedGeneration,
        generationIndex: 0,
        onLossUpdate: onTrainedCarLossUpdate,
      })
    )
  );

  const automaticParkingLifetimeTimer = useRef<NodeJS.Timeout | null>(null);

  const logger = loggerBuilder({ context: 'AutomaticTab' });

  const automaticParkingCycleLifetimeMs = TRAINED_CAR_GENERATION_LIFETIME * SECOND;
  const automaticWorldVersion = `automatic-${bestTrainedCarCycleIndex}`;

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

  const onPerformanceBoost = (state: boolean) => {
    setPerformanceBoost(state);
  };

  const onBestGenomeEdit = (editedGenome: Genome) => {
    logger.info('Updating genome', editedGenome);

    const updatedGeneration: Generation = [editedGenome];

    setBestTrainedGeneration(updatedGeneration);

    setBestTrainedCars(Object.values(
      generationToCars({
        generation: updatedGeneration,
        generationIndex: 0,
        onLossUpdate: onTrainedCarLossUpdate,
      })
    ));

    bestTrainedCarLossRef.current = null;
    setBestTrainedCarLoss(null);
    setBestTrainedCarCycleIndex(bestTrainedCarCycleIndex + 1);

    countDownAutomaticParkingCycleLifetime(onAutomaticCycleLifetimeEnd);

    enqueue({
      message: 'Genome has been updated and applied to the displayed car',
      startEnhancer: ({size}) => <Check size={size} />,
    }, DURATION.medium);
  };

  const onChangeGenomeIndex = (index: number) => {
    setSelectedGenomeIndex(index);
    onBestGenomeEdit(BEST_GENOMES[dynamicCarsPosition][index]);
    setSearchParam(GENOME_IDX_URL_PARAM, `${index}`);
  };

  const onCarsPositionChange = (position: DynamicCarsPosition) => {
    setDynamicCarsPosition(position);
    setSelectedGenomeIndex(defaultGenomeIndex);
    onBestGenomeEdit(BEST_GENOMES[position][defaultGenomeIndex]);
    setSearchParam(START_POSITION_URL_PARAM, position);
    setSearchParam(GENOME_IDX_URL_PARAM, `${defaultGenomeIndex}`);
  };

  // Start the automatic parking cycles.
  useEffect(() => {
    countDownAutomaticParkingCycleLifetime(onAutomaticCycleLifetimeEnd);
    return () => {
      cancelAutomaticCycleTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestTrainedCarCycleIndex]);

  return (
    <Block>
      <World
        version={automaticWorldVersion}
        performanceBoost={performanceBoost}
      >
        <ParkingAutomatic
          performanceBoost={performanceBoost}
          cars={bestTrainedCars}
          carsPosition={dynamicCarsPosition}
          withVisibleSensors
          withLabels
        />
      </World>
      <Block marginTop="20px">
        <Notification overrides={{Body: {style: {width: 'auto'}}}}>
          See the trained (almost) self-parking car in action<br/><br/>
          <small>You may also update genome values to see how it affects the car's behavior</small>
        </Notification>
      </Block>
      <AutomaticParkingAnalytics
        genomes={BEST_GENOMES[dynamicCarsPosition]}
        bestGenome={bestTrainedGeneration[0]}
        minLoss={bestTrainedCarLoss}
        generationLifetimeMs={automaticParkingCycleLifetimeMs}
        batchVersion={automaticWorldVersion}
        carsBatchIndex={bestTrainedCarCycleIndex}
        performanceBoost={performanceBoost}
        selectedGenomeIndex={selectedGenomeIndex}
        carsPosition={dynamicCarsPosition}
        onCarsPositionChange={onCarsPositionChange}
        onBestGenomeEdit={onBestGenomeEdit}
        onChangeGenomeIndex={onChangeGenomeIndex}
        onPerformanceBoost={onPerformanceBoost}
      />
    </Block>
  );
}

function getCarsPositionFromURL(): DynamicCarsPosition {
  // @ts-ignore
  const carPositionFromUrl: DynamicCarsPosition = getStringSearchParam(
    START_POSITION_URL_PARAM,
    DEFAULT_START_POSITION
  );
  if ([DYNAMIC_CARS_POSITION_FRONT, DYNAMIC_CARS_POSITION_MIDDLE].includes(carPositionFromUrl)) {
    return carPositionFromUrl;
  }
  return DEFAULT_START_POSITION;
}

export default EvolutionTabAutomatic;
