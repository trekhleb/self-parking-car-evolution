import React from 'react';
import { Panel, StatelessAccordion } from 'baseui/accordion';
import { Genome } from '../../libs/genetic';
import GenomePreview from './GenomePreview';
import { CarLicencePlateType } from '../world/types/car';

const GENOME_PANELS = {
  firstBestGenome: 'first-best-genome',
  secondBestGenome: 'second-best-genome',
};

type BestGenomesProps = {
  bestGenomePanelTitle?: string,
  bestGenome: Genome | null,
  bestCarLicencePlate?: CarLicencePlateType | null,
  minLoss?: number | null,
  secondBestGenomePanelTitle?: string,
  secondBestGenome?: Genome | null,
  secondBestCarLicencePlate?: CarLicencePlateType | null,
  secondMinLoss?: number | null,
  editable?: boolean,
  onBestGenomeEdit?: (genome: Genome) => void,
};

function BestGenomes(props: BestGenomesProps): React.ReactElement {
  const {
    bestGenomePanelTitle = '1st Best Car Genome',
    bestGenome,
    bestCarLicencePlate,
    minLoss,
    secondBestGenomePanelTitle = '2nd Best Car Genome',
    secondBestGenome,
    secondBestCarLicencePlate,
    secondMinLoss,
    editable = false,
    onBestGenomeEdit = (genome: Genome) => {},
  } = props;

  const [genomeExpandedTabs, setGenomeExpandedTabs] = React.useState<React.Key[]>([
    GENOME_PANELS.firstBestGenome
  ]);

  const onPanelChange = (
    {key, expanded}: {key: React.Key, expanded: React.Key[]}
  ) => {
    const newGenomeExpandedTabs = [...genomeExpandedTabs];
    const openedTabIndex = newGenomeExpandedTabs.indexOf(key);
    if (openedTabIndex === -1) {
      newGenomeExpandedTabs.push(key);
    } else {
      newGenomeExpandedTabs.splice(openedTabIndex);
    }
    setGenomeExpandedTabs(newGenomeExpandedTabs);
  };

  const bestGenomePreview = (
    <GenomePreview
      genome={bestGenome}
      licencePlate={bestCarLicencePlate}
      loss={minLoss}
      editable={editable}
      onGenomeEdit={onBestGenomeEdit}
    />
  );

  const secondBestGenomePreview = secondBestGenome !== undefined ? (
    <GenomePreview
      genome={secondBestGenome}
      licencePlate={secondBestCarLicencePlate}
      loss={secondMinLoss}
    />
  ) : null;

  const panels = [];

  const firstBestGenomePanel = (
    <Panel title={bestGenomePanelTitle} key={GENOME_PANELS.firstBestGenome}>
      {bestGenomePreview}
    </Panel>
  );

  const secondBestGenomePanel = secondBestGenomePreview ? (
    <Panel title={secondBestGenomePanelTitle} key={GENOME_PANELS.secondBestGenome}>
      {secondBestGenomePreview}
    </Panel>
  ) : null;

  panels.push(firstBestGenomePanel);
  if (secondBestGenomePanel) {
    panels.push(secondBestGenomePanel);
  }

  return (
    <StatelessAccordion
      expanded={genomeExpandedTabs}
      onChange={onPanelChange}
    >
      {panels}
    </StatelessAccordion>
  );
}

export default BestGenomes;
