import * as React from 'react';
import { Block } from 'baseui/block';
import { CSSProperties, FormEvent, useState } from 'react';
import { Textarea } from 'baseui/textarea';
import { Button, SHAPE as BUTTON_SHAPE, KIND as BUTTON_KIND, SIZE as BUTTON_SIZE } from 'baseui/button';
import { BiEdit, FaRegSave } from 'react-icons/all';

import { Gene, Genome } from '../../libs/genetic';
import { CarLicencePlateType } from '../world/types/car';
import { FormControl } from 'baseui/form-control';
import { formatLossValue } from './utils/evolution';
import { CAR_SENSORS_NUM, carLossToFitness, decodeGenome, FormulaCoefficients } from '../../libs/carGenetic';
import { FITNESS_ALPHA } from './constants/evolution';

type GenomePreviewProps = {
  genome: Genome | null,
  title?: string,
  licencePlate?: CarLicencePlateType | null,
  loss?: number | null,
  editable?: boolean,
  onGenomeEdit?: (genome: Genome) => void,
};

const genomeSeparator = ' ';

const commonGenomeStyles: CSSProperties = {
  paddingTop: '15px',
  paddingRight: '15px',
  paddingBottom: '15px',
  paddingLeft: '15px',
  fontSize: '12px',
  backgroundColor: '#FFFFFF',
  lineHeight: '20px',
  fontFamily: 'monospace',
};

function GenomePreview(props: GenomePreviewProps) {
  const {
    title,
    genome,
    licencePlate,
    loss,
    editable = false,
    onGenomeEdit = (genome: Genome) => {},
  } = props;

  const [shortEngineFormula] = useState<boolean>(true);
  const [shortWheelsFormula] = useState<boolean>(true);

  const [isEditableGenome, setIsEditableGenome] = useState<boolean>(false);
  const [editedGenome, setEditedGenome] = useState<Genome | null>(genome);
  const [genomeError, setGenomeError] = useState<string | null>(null);

  const onGenomeUpdate = (genomeString: string) => {
    if (!genome) {
      return;
    }

    const genomeFromString: Genome = genomeString
      .trim()
      .split('')
      .filter((geneString: string) => ['0', '1'].includes(geneString))
      .map((geneString: string) => {
        const gene: Gene = geneString === '0' ? 0 : 1;
        return gene;
      });
    setEditedGenome(genomeFromString);

    if (genomeFromString.length !== genome.length) {
      setGenomeError(`Genome must have ${genome.length} genes. Currently it has ${genomeFromString.length} genes.`);
    } else {
      setGenomeError(null);
    }
  };

  const onEditToggle = () => {
    if (editedGenome && isEditableGenome && !genomeError) {
      onGenomeEdit(editedGenome)
    }
    setIsEditableGenome(!isEditableGenome);
  };

  const genomeCaption = (
    <Block display="flex" flexDirection="row">
      {genome && (
        <Block marginRight="10px">
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
          Fitness: <b>{formatLossValue(carLossToFitness(loss, FITNESS_ALPHA))}</b>
        </Block>
      )}
    </Block>
  );

  const label = title || 'Car genome';

  const genomeEditButtonIcon = !isEditableGenome ? (
    <BiEdit title="Edit genome" />
  ) : null;

  const genomeSaveButtonIcon = isEditableGenome ? (
    <FaRegSave title="Save genome" />
  ) : null;

  const genomeEditButtons = editable ? (
    <Block
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      marginBottom="-30px"
    >
      <Button
        onClick={onEditToggle}
        shape={BUTTON_SHAPE.pill}
        kind={BUTTON_KIND.minimal}
        size={BUTTON_SIZE.default}
        disabled={!!genomeError}
        overrides={{
          BaseButton: {
            style: {
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              marginTop: '5px',
              display: 'block',
            },
            props: {
              title: isEditableGenome ? 'Save genome' : 'Edit genome',
            },
          },
        }}
      >
        <Block>
          {genomeEditButtonIcon}
          {genomeSaveButtonIcon}
        </Block>
      </Button>
    </Block>
  ) : null;

  const genomePreviewLabel = (
    <Block>
      {label}
    </Block>
  );

  const genomeString = (genome || []).join(genomeSeparator);
  const genomePreviewOutput = (
    <FormControl
      label={genomePreviewLabel}
      caption={genomeCaption}
    >
      <CodeBlock>
        {genomeString}
      </CodeBlock>
    </FormControl>
  );

  const editedGenomeString = (editedGenome || []).join(genomeSeparator);
  const genomeEditableOutput = (
    <FormControl
      label={() => genomePreviewLabel}
      caption={(
        <span>
          Copy/paste whole genome or double-click the specific gene and change it
        </span>
      )}
      error={genomeError}
    >
      <Textarea
        value={editedGenomeString}
        onChange={(event: FormEvent<HTMLTextAreaElement>) => {
          // @ts-ignore
          onGenomeUpdate(event.target.value);
        }}
        overrides={{
          Input: {
            style: {
              ...commonGenomeStyles,
              height: '120px',
            },
          },
        }}
        error={!!genomeError}
        autoFocus
      />
    </FormControl>
  );

  const genomeOutput = isEditableGenome ? genomeEditableOutput : genomePreviewOutput;

  let decodedEngineFormula = null;
  let decodedWheelsFormula = null;
  if (genome) {
    const { engineFormulaCoefficients, wheelsFormulaCoefficients } = decodeGenome(genome);
    decodedEngineFormula = (
      <Coefficients
        label="Engine formula"
        caption={
          `Multipliers for ${CAR_SENSORS_NUM} car sensors (+1 bias unit) that define the engine mode (backward, neutral, forward)`
        }
        coefficients={engineFormulaCoefficients}
        shortNumbers={shortEngineFormula}
      />
    );
    decodedWheelsFormula = (
      <Coefficients
        label="Wheels formula"
        caption={
          `Multipliers for ${CAR_SENSORS_NUM} car sensors (+1 bias unit) that define the wheels direction (left, straight, right)`
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
        {genomeEditButtons}
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
        ...commonGenomeStyles,
        border: '1px dotted #CCCCCC',
        borderRadius: '3px',
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
