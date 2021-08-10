import React, { useEffect, useRef, useState } from 'react';
import { Block } from 'baseui/block';

import { Generation, Genome } from '../../lib/genetic';
import { CarLicencePlateType, CarType } from '../world/types/car';
import {
  SECOND,
  TRAINED_CAR_GENERATION_LIFETIME
} from './EvolutionBoardParams';
import { generationToCars } from './utils/evolution';
import { loggerBuilder } from '../../utils/logger';
import { FIRST_BEST_GENOME } from './constants/genomes';
import AutomaticParkingAnalytics from './AutomaticParkingAnalytics';
import World from '../world/World';
import ParkingAutomatic from '../world/parkings/ParkingAutomatic';

const bestDefaultTrainedGeneration: Generation = [
  FIRST_BEST_GENOME,
];

function EvolutionTabAutomatic() {
  const bestTrainedCarLossRef = useRef<number | null>(null);
  const onTrainedCarLossUpdate = (licensePlate: CarLicencePlateType, loss: number) => {
    bestTrainedCarLossRef.current = loss;
  };

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
  };

  // Start the automatic parking cycles.
  useEffect(() => {
    countDownAutomaticParkingCycleLifetime(onAutomaticCycleLifetimeEnd);
    return () => {
      cancelAutomaticCycleTimer();
    };
  }, [
    bestTrainedCarCycleIndex,
  ]);

  return (
    <Block>
      <World version={automaticWorldVersion}>
        <ParkingAutomatic
          cars={bestTrainedCars}
          withVisibleSensors
          withLabels
        />
      </World>
      <AutomaticParkingAnalytics
        bestGenome={bestTrainedGeneration[0]}
        minLoss={bestTrainedCarLoss}
        generationLifetimeMs={automaticParkingCycleLifetimeMs}
        batchVersion={automaticWorldVersion}
        carsBatchIndex={bestTrainedCarCycleIndex}
        onBestGenomeEdit={onBestGenomeEdit}
      />
    </Block>
  );
}

export default EvolutionTabAutomatic;
