import React from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE as BUTTON_SIZE } from 'baseui/button';
import { BiDownload, BiUpload } from 'react-icons/all';
import { saveAs } from 'file-saver';

import Row from '../shared/Row';
import { Generation, Percentage, Probability } from '../../libs/genetic';

export type EvolutionCheckpoint = {
  dateTime: string,
  generationIndex: number,
  lossHistory: number[],
  avgLossHistory: number[],
  performanceBoost: boolean,
  generationSize: number,
  generationLifetime: number,
  carsBatchSize: number,
  mutationProbability: Probability,
  longLivingChampionsPercentage: Percentage,
  generation: Generation,
};

type EvolutionCheckpointSaverProps = {
  onRestoreFromCheckpoint: (checkpoint: EvolutionCheckpoint) => void,
  onCheckpointToFile: () => EvolutionCheckpoint,
};

function EvolutionCheckpointSaver(props: EvolutionCheckpointSaverProps) {
  const {
    onRestoreFromCheckpoint,
    onCheckpointToFile,
  } = props;

  const onSaveEvolution = () => {
    const checkpoint: EvolutionCheckpoint = onCheckpointToFile();
    const fileName = `evolution-checkpoint--generation-${checkpoint.generationIndex}--size-${checkpoint.generationSize}.json`;
    const checkpointString: string = JSON.stringify(checkpoint);
    const checkpointBlob = new Blob(
      [checkpointString],
      { type: 'application/json' },
    );
    saveAs(checkpointBlob, fileName);
  };

  const onRestoreEvolution = () => {
    const checkpoint: EvolutionCheckpoint = {
      dateTime: '',
      generationIndex: 0,
      lossHistory: [],
      avgLossHistory: [],
      performanceBoost: false,
      generationSize: 0,
      generationLifetime: 0,
      carsBatchSize: 0,
      mutationProbability: 0,
      longLivingChampionsPercentage: 0,
      generation: [],
    };
    onRestoreFromCheckpoint(checkpoint);
  }

  return (
    <Row>
      <Block marginRight="5px">
        <Button
          startEnhancer={() => <BiDownload />}
          size={BUTTON_SIZE.compact}
          onClick={onSaveEvolution}
        >
          Save evolution
        </Button>
      </Block>

      <Block marginLeft="5px">
        <Button
          startEnhancer={() => <BiUpload />}
          size={BUTTON_SIZE.compact}
          onClick={onRestoreEvolution}
        >
          Restore evolution
        </Button>
      </Block>
    </Row>
  );
}

export default EvolutionCheckpointSaver;
