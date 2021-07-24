import React from 'react';
import { Panel, StatelessAccordion } from 'baseui/accordion';
import { Genome } from '../../lib/genetic';
import GenomePreview from './GenomePreview';
import { CarLicencePlateType } from '../world/types/car';

const GENOME_PANELS = {
  firstBestGenome: 'first-best-genome',
  secondBestGenome: 'second-best-genome',
};

type BestGenomesProps = {
  bestGenome: Genome | null,
  bestCarLicencePlate: CarLicencePlateType | null,
  minLoss: number | null,
  secondBestGenome: Genome | null,
  secondBestCarLicencePlate: CarLicencePlateType | null,
  secondMinLoss: number | null,
};

function BestGenomes(props: BestGenomesProps): React.ReactElement {
  const {
    bestGenome,
    bestCarLicencePlate,
    minLoss,
    secondBestGenome,
    secondBestCarLicencePlate,
    secondMinLoss,
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
    />
  );

  const secondBestGenomePreview = (
    <GenomePreview
      genome={secondBestGenome}
      licencePlate={secondBestCarLicencePlate}
      loss={secondMinLoss}
    />
  );

  return (
    <StatelessAccordion
      expanded={genomeExpandedTabs}
      onChange={onPanelChange}
    >
      <Panel title="1st Best Car Genome" key={GENOME_PANELS.firstBestGenome}>
        {bestGenomePreview}
      </Panel>
      <Panel title="2nd Best Car Genome" key={GENOME_PANELS.secondBestGenome}>
        {secondBestGenomePreview}
      </Panel>
    </StatelessAccordion>
  );
}

export default BestGenomes;
