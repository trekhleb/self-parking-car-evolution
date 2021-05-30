import React, { useEffect } from 'react';

import { useKeyPress } from '../../hooks/useKeyPress';
import { trigger, carEvents } from '../utils/events';

function CarKeyboardController() {
  const forward = useKeyPress(['w', 'ArrowUp']);
  const backward = useKeyPress(['s', 'ArrowDown']);
  const left = useKeyPress(['a', 'ArrowLeft']);
  const right = useKeyPress(['d', 'ArrowRight']);
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

  return null;
}

export default CarKeyboardController;
