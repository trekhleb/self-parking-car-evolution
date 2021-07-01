import { Paragraph4 } from 'baseui/typography';
import React, { useEffect } from 'react';

import { useKeyPress } from '../../../hooks/useKeyPress';
import { trigger, carEvents } from '../utils/events';
import { Block } from 'baseui/block';
import { WORLD_CONTAINER_HEIGHT } from '../constants/world';

function CarKeyboardController() {
  // const forward = useKeyPress(['w', 'ArrowUp']);
  // const backward = useKeyPress(['s', 'ArrowDown']);
  // const left = useKeyPress(['a', 'ArrowLeft']);
  // const right = useKeyPress(['d', 'ArrowRight']);
  // const brake = useKeyPress([' ']);

  const forward = useKeyPress(['w']);
  const backward = useKeyPress(['s']);
  const left = useKeyPress(['a']);
  const right = useKeyPress(['d']);
  const brake = useKeyPress([' ']);

  useEffect(() => {
    // Left-right.
    if (left && !right) {
      trigger(carEvents.wheelsLeft);
    } else if (right && !left) {
      trigger(carEvents.wheelsRight);
    } else {
      trigger(carEvents.wheelsStraight);
    }

    // Front-back.
    if (forward && !backward) {
      trigger(carEvents.engineForward);
    } else if (backward && !forward) {
      trigger(carEvents.engineBackward);
    } else {
      trigger(carEvents.engineNeutral);
    }

    // Break.
    if (brake) {
      trigger(carEvents.pressBreak);
    }
    if (!brake) {
      trigger(carEvents.releaseBreak);
    }
  }, [forward, backward, left, right, brake]);

  return (
    <Block
      position="relative"
      marginTop={`${-WORLD_CONTAINER_HEIGHT}px`}
      paddingLeft="15px"
    >
      <Paragraph4 $style={{color: 'white'}}>
        {/*<code>WASD</code> or <code>↑→↓←</code> to drive. <code>SPACE</code> to break.*/}
        <code>WASD</code> keys to drive. <code>SPACE</code> to break.
      </Paragraph4>
    </Block>
  );
}

export default CarKeyboardController;
