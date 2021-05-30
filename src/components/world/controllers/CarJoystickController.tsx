import React from 'react';

import ReactNipple from 'react-nipple';

function CarJoystickController() {
  const nippleSize = 100;

  const onMove = (event: any, data: any) => {
    console.log(data.direction, data.angle);
  };

  const onEnd = (event: any, data: any) => {
    console.log('onEnd');
  };

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
      position: { top: '50%', left: '50%' }
    }}
    // @see: https://github.com/yoannmoinet/nipplejs#start
    onMove={onMove}
    onEnd={onEnd}
  />
}

export default CarJoystickController;
