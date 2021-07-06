import * as React from 'react';
import { Block } from 'baseui/block';

import { Genome } from '../../lib/genetic';
import { CarLicencePlateType } from '../world/types/car';
import { Textarea, SIZE as TEXTAREA_SIZE} from 'baseui/textarea';
import { FormControl } from 'baseui/form-control';
import { formatLossValue } from './utils/evolution';

type GenomePreviewProps = {
  genome: Genome | null,
  licencePlate?: CarLicencePlateType | null,
  loss?: number | null,
};

function GenomePreview(props: GenomePreviewProps) {
  const {genome, licencePlate, loss} = props;

  const genomeCaption = (
    <Block display="flex" flexDirection="row">
      {licencePlate && (
        <Block marginRight="15px">
          Licence plate: <b>{licencePlate}</b>
        </Block>
      )}
      {loss && (
        <Block>
          Loss: <b>{formatLossValue(loss)}</b>
        </Block>
      )}
    </Block>
  );

  const genomeString = (genome || []).join('');
  const genomeOutput = (
    <FormControl
      label={() => (
        <span>Best genome so far</span>
      )}
      caption={genomeCaption}
    >
      <Textarea
        value={genomeString}
        size={TEXTAREA_SIZE.compact}
      />
    </FormControl>
  );

  return (
    <Block>
      {genomeOutput}
    </Block>
  );
}

export default GenomePreview;
