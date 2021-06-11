import React from 'react';

import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import {
  HiRefresh,
  IoMdPause,
  IoPlaySharp
} from 'react-icons/all';
import { ButtonGroup, MODE } from 'baseui/button-group';

type EvolutionPlaybackButtonsProps = {
  isPlaying: boolean,
  onStart: () => void,
  onPause: () => void,
  onReset: () => void,
};

function EvolutionPlaybackButtons(props: EvolutionPlaybackButtonsProps) {
  const {isPlaying, onStart, onPause, onReset} = props;

  const startButton = (
    <Button
      onClick={onStart}
      startEnhancer={<IoPlaySharp />}
      disabled={isPlaying}
    >
      Start evolution
    </Button>
  );

  const pauseButton = (
    <Button
      onClick={onPause}
      startEnhancer={<IoMdPause />}
      disabled={!isPlaying}
    >
      Pause
    </Button>
  );

  const resetButton = (
    <Button
      onClick={onReset}
      startEnhancer={<HiRefresh size={20} />}
    >
      Reset
    </Button>
  );

  const selectedButton = isPlaying ? 1 : 0;

  return (
    <Block>
      <ButtonGroup
        mode={MODE.radio}
        selected={selectedButton}
      >
        {startButton}
        {pauseButton}
        {resetButton}
      </ButtonGroup>
    </Block>
  );
}

export default EvolutionPlaybackButtons;
