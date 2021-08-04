import React, { useState } from 'react';

import World from '../world/World';
import { getSearchParam } from '../../utils/url';
import ParkingManual from '../world/parkings/ParkingManual';

const STAT_SEARCH_PARAM_NAME = 'stats';

function EvolutionTabManual() {
  const [withStat] = useState<boolean>(!!getSearchParam(STAT_SEARCH_PARAM_NAME));

  return (
    <>
      <World
        withPerfStats={withStat}
        withJoystickControl
        withKeyboardControl
      >
        <ParkingManual withLabels withSensors />
      </World>
    </>
  );
}

export default EvolutionTabManual;
