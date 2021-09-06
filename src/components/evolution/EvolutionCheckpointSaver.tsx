import React from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE as BUTTON_SIZE } from 'baseui/button';
import { BiDownload, BiUpload } from 'react-icons/all';
import { saveAs } from 'file-saver';

import Row from '../shared/Row';
import { Generation } from '../../libs/genetic';

export type EvolutionCheckpoint = {
  generationIndex: number | null,
  lossHistory: number[],
  avgLossHistory: number[],
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
    const jsonIndent = 2;
    const checkpointString: string = JSON.stringify(checkpoint, null, jsonIndent);
    const checkpointBlob = new Blob(
      [checkpointString],
      { type: 'application/json' },
    );
    saveAs(checkpointBlob, 'test.json');
  };

  const onRestoreEvolution = () => {
    const checkpoint: EvolutionCheckpoint = {
      generationIndex: null,
      lossHistory: [],
      avgLossHistory: [],
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
