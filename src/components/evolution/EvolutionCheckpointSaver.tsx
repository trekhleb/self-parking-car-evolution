import React, { useState } from 'react';
import { Block } from 'baseui/block';
import { 
  Button,
  SIZE as BUTTON_SIZE,
  SHAPE as BUTTON_SHAPE,
  KIND as BUTTON_KIND,
} from 'baseui/button';
import { BiDownload, BiUpload } from 'react-icons/all';
import { saveAs } from 'file-saver';
import {
  Modal,
  ModalHeader,
  ModalBody,
  SIZE,
  ROLE
} from 'baseui/modal';
import { FileUploader } from 'baseui/file-uploader';
import { Notification, KIND as NOTIFICATION_KIND } from 'baseui/notification';
import { Paragraph3 } from 'baseui/typography';

import Row from '../shared/Row';
import { Generation, Percentage, Probability } from '../../libs/genetic';
import { CHECKPOINTS_PATH } from '../../constants/links';
import demoCheckpoint from '../../checkpoints/ckpt--population-1000--generation-36.json';

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

  const [showCheckpointModal, setShowCheckpointModal] = useState<boolean>(false);
  const [checkpointIsProcessing, setCheckpointIsProcessing] = useState<boolean>(false);
  const [checkpointErrorMessage, setCheckpointErrorMessage] = useState<string | null>(null);

  const onSaveEvolution = () => {
    const checkpoint: EvolutionCheckpoint = onCheckpointToFile();
    const fileName = `ckpt--population-${checkpoint.generationSize}--generation-${checkpoint.generationIndex}.json`;
    const checkpointString: string = JSON.stringify(checkpoint);
    const checkpointBlob = new Blob(
      [checkpointString],
      { type: 'application/json' },
    );
    saveAs(checkpointBlob, fileName);
  };

  const onCheckpointModalOpen = () => {
    setCheckpointErrorMessage(null);
    setCheckpointIsProcessing(false);
    setShowCheckpointModal(true);
  };

  const onCheckpointModalClose = () => {
    setShowCheckpointModal(false);
  };

  const onCancelCheckpointUpload = () => {
    setCheckpointIsProcessing(false);
  };

  const onFileDrop = (acceptedFiles: File[]) => {
    try {
      setCheckpointIsProcessing(true);

      const onFileReaderLoaded = (event: Event) => {
        // @ts-ignore
        const checkpoint: EvolutionCheckpoint = JSON.parse(event.target.result);
        onRestoreFromCheckpoint(checkpoint);
        setCheckpointIsProcessing(false);
        onCheckpointModalClose();
      };
  
      const fileReader = new FileReader();
      fileReader.onload = onFileReaderLoaded;
      fileReader.readAsText(acceptedFiles[0]);
    } catch (error: any) {
      setCheckpointErrorMessage(error.message);
      setCheckpointIsProcessing(false);
    }
  };

  const onUseDemoCheckpoint = () => {
    try {
      // @ts-ignore
      onRestoreFromCheckpoint(demoCheckpoint);
      onCheckpointModalClose();
    } catch (error: any) {
      setCheckpointErrorMessage(error.message);
    }
  };

  const checkpointError = checkpointErrorMessage ? (
    <Notification
      kind={NOTIFICATION_KIND.negative}
      overrides={{
        Body: {style: {width: 'auto'}},
      }}
    >
      {checkpointErrorMessage}
    </Notification>
  ) : null;

  const checkpointModal = (
    <Modal
      onClose={onCheckpointModalClose}
      closeable
      isOpen={showCheckpointModal}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
    >
      <ModalHeader>Restore evolution from the checkpoint file</ModalHeader>
      <ModalBody>
        {checkpointError}
        <Paragraph3>
          Checkpoint is a <code>json</code> file that contain the history of the evolution and the list of genomes from the latest generation.
        </Paragraph3>
        <Paragraph3>
          You may save your own evolution progress to the checkpoint file or use <a style={{color: 'black'}} href={CHECKPOINTS_PATH}>one of the pre-trained checkpoints</a>.
        </Paragraph3>

        <Block marginBottom="20px">
          <Button
            size={BUTTON_SIZE.compact}
            shape={BUTTON_SHAPE.pill}
            kind={BUTTON_KIND.secondary}
            onClick={onUseDemoCheckpoint}
          >
            Use demo checkpoint  
          </Button>
        </Block>

        <FileUploader
          onCancel={onCancelCheckpointUpload}
          onDrop={onFileDrop}
          accept="application/json"
          multiple={false}
          progressMessage={checkpointIsProcessing ? 'Processing...' : ''}
        />
      </ModalBody>
    </Modal>
  );

  return (
    <>
      <Row>
        <Block marginRight="5px">
          <Button
            startEnhancer={() => <BiDownload size={18} />}
            size={BUTTON_SIZE.compact}
            shape={BUTTON_SHAPE.pill}
            onClick={onSaveEvolution}
          >
            Save evolution
          </Button>
        </Block>

        <Block marginLeft="5px">
          <Button
            startEnhancer={() => <BiUpload size={18} />}
            size={BUTTON_SIZE.compact}
            shape={BUTTON_SHAPE.pill}
            onClick={onCheckpointModalOpen}
          >
            Restore evolution
          </Button>
        </Block>
      </Row>

      {checkpointModal}
    </>
  );
}

export default EvolutionCheckpointSaver;
