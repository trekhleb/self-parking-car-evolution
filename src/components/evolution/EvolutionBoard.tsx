import React, { useState } from 'react';
import { Population } from '../../lib/genetic';
import { Block } from 'baseui/block';
import Worlds from '../world/Worlds';

function EvolutionBoard() {
  const [population, setPopulation] = useState<Population[]>([]);

  return (
    <>
      <Block>
        <Worlds />
      </Block>
      <Block>
        Evolution board here
      </Block>
    </>
  );
}

export default EvolutionBoard;
