import React from 'react';
import throttle from 'lodash/throttle';
import ReactNipple from 'react-nipple';

import { carEvents, trigger } from '../utils/events';

function CarJoystickController() {
  const nippleSize = 100;
  const delta = 30;
  const throttleTimeout = 250;

  const onMove = (event: any, data: any) => {
    const angle = data.angle.degree;
    if (angle < (90 - delta) || angle > (270 + delta)) {
      trigger(carEvents.wheelsRight);
    } else if (angle > (90 + delta) && angle < (270 - delta)) {
      trigger(carEvents.wheelsLeft);
    }
    if (angle > delta && angle < (180 - delta)) {
      trigger(carEvents.engineForward);
    } else if (angle > (180 + delta) && angle < (360 - delta)) {
      trigger(carEvents.engineBackward);
    }
  };

  const onMoveThrottled = throttle(onMove, throttleTimeout, {
    leading: false,
    trailing: true,
  });

  const onEnd = (event: any, data: any) => {
    trigger(carEvents.releaseBreak);
    trigger(carEvents.engineNeutral);
    trigger(carEvents.wheelsStraight);
  };

  const onEndThrottled = throttle(onEnd, throttleTimeout + 10, {
    leading: false,
    trailing: true,
  });

  return <ReactNipple
    style={{
      width: nippleSize,
      height: nippleSize,
      marginTop: -nippleSize - 20,
      marginLeft: `calc(50% - ${Math.floor(nippleSize / 2)}px)`,
      position: 'absolute',
    }}
    // @see: https://github.com/yoannmoinet/nipplejs#options
    options={{
      dynamicPage: true,
      color: 'white',
      mode: 'static',
      size: nippleSize,
      position: { top: '50%', left: '50%' },
    }}
    // @see: https://github.com/yoannmoinet/nipplejs#start
    onMove={onMoveThrottled}
    onEnd={onEndThrottled}
  />
}

export default CarJoystickController;
