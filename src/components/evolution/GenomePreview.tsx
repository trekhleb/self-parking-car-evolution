import * as React from 'react';
import { Block } from 'baseui/block';
import { useState } from 'react';

import { Genome } from '../../lib/genetic';
import { CarLicencePlateType } from '../world/types/car';
import { FormControl } from 'baseui/form-control';
import { formatLossValue } from './utils/evolution';
import { CAR_SENSORS_NUM, carLossToFitness, decodeGenome, FormulaCoefficients } from '../../lib/carGenetic';

type GenomePreviewProps = {
  genome: Genome | null,
  title?: string,
  licencePlate?: CarLicencePlateType | null,
  loss?: number | null,
};

function GenomePreview(props: GenomePreviewProps) {
  const {title, genome, licencePlate, loss} = props;

  const [shortEngineFormula, setShortEngineFormula] = useState<boolean>(true);
  const [shortWheelsFormula, setShortWheelsFormula] = useState<boolean>(true);

  const genomeCaption = (
    <Block display="flex" flexDirection="row">
      {genome && (
        <Block marginRight="15px">
          Genes: <b>{genome.length}</b>
        </Block>
      )}
      {licencePlate && (
        <Block marginRight="15px">
          Licence plate: <b>{licencePlate}</b>
        </Block>
      )}
      {loss && (
        <Block marginRight="15px">
          Loss: <b>{formatLossValue(loss)}</b>
        </Block>
      )}
      {loss && (
        <Block>
          Fitness: <b>{formatLossValue(carLossToFitness(loss))}</b>
        </Block>
      )}
    </Block>
  );

  const label = title || 'Car genome';

  const genomeString = (genome || []).join(' ');
  const genomeOutput = (
    <FormControl
      label={() => (
        <span>{label}</span>
      )}
      caption={genomeCaption}
    >
      <CodeBlock>
        {genomeString}
      </CodeBlock>
    </FormControl>
  );

  let decodedEngineFormula = null;
  let decodedWheelsFormula = null;
  if (genome) {
    const { engineFormulaCoefficients, wheelsFormulaCoefficients } = decodeGenome(genome);
    decodedEngineFormula = (
      <Coefficients
        label="Engine formula"
        caption={
          `Multipliers for ${CAR_SENSORS_NUM} car sensors that define the engine mode (backward, neutral, forward)`
        }
        coefficients={engineFormulaCoefficients}
        shortNumbers={shortEngineFormula}
      />
    );
    decodedWheelsFormula = (
      <Coefficients
        label="Wheels formula"
        caption={
          `Multipliers for ${CAR_SENSORS_NUM} car sensors that define the wheels direction (left, straight, right)`
        }
        coefficients={wheelsFormulaCoefficients}
        shortNumbers={shortWheelsFormula}
      />
    );
  }

  const blocksMarginBottom = '30px';

  return (
    <Block>
      <Block marginBottom={blocksMarginBottom}>
        {genomeOutput}
      </Block>

      <Block marginBottom={blocksMarginBottom}>
        {decodedEngineFormula}
      </Block>

      <Block marginBottom={blocksMarginBottom}>
        {decodedWheelsFormula}
      </Block>
    </Block>
  );
}

type CoefficientsProps = {
  label: string,
  caption: string,
  coefficients: FormulaCoefficients,
  shortNumbers: boolean,
};

function Coefficients(props: CoefficientsProps) {
  const {coefficients, label, caption, shortNumbers} = props;
  const coefficientsString = coefficients
    .map((coefficient: number) => formatCoefficient(coefficient, shortNumbers))
    .join(', ');
  return (
    <Block>
      <FormControl
        label={() => label}
        caption={() => caption}
      >
        <CodeBlock>
          {coefficientsString}
        </CodeBlock>
      </FormControl>
    </Block>
  );
}

type CodeBlockProps = {
  children: React.ReactNode,
};

function CodeBlock(props: CodeBlockProps) {
  const {children} = props;
  return (
    <>
      <Block $style={{
        border: '1px dotted #CCCCCC',
        padding: '15px',
        borderRadius: '3px',
        fontSize: '12px',
        backgroundColor: '#FFFFFF',
      }}>
        <code>
          {children}
        </code>
      </Block>
    </>
  );
}

function formatCoefficient(coefficient: number, shortNumber: boolean = true): number {
  if (shortNumber) {
    return Math.ceil(coefficient * 1000) / 1000;
  }
  return coefficient;
}

export default GenomePreview;
