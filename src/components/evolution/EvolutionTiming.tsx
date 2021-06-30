import React from 'react';
import { Label3 } from 'baseui/typography';
import {Tag, VARIANT as TAG_VARIANT} from 'baseui/tag';
import { Block } from 'baseui/block';
import {Notification, KIND as NOTIFICATION_KIND} from 'baseui/notification';

import Timer from '../shared/Timer';

type EvolutionTimingProps = {
  generationIndex: number | null,
  batchIndex: number | null,
  generationLifetimeMs: number,
  batchVersion: string,
};

function EvolutionTiming(props: EvolutionTimingProps) {
  const {generationIndex, batchIndex, generationLifetimeMs, batchVersion} = props;

  if (generationIndex === null || batchIndex === null) {
    return null;
  }

  return (
    <Block marginBottom="20px" marginTop="20px">
      <Notification
        closeable={false}
        kind={NOTIFICATION_KIND.warning}
        overrides={{
          Body: {style: {width: 'auto'}},
          InnerContainer: {style: {flex: 1}},
        }}
      >
        <Block
          display="flex"
          flexDirection={['column', 'row', 'row']}
          alignItems={['flex-start', 'center', 'center']}
          justifyContent="space-between"
          width="auto"
          flex="1"
        >
          <TimingColumn caption="Generation">
            <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
              <small>#</small>{generationIndex + 1}
            </Tag>
          </TimingColumn>

          <TimingColumn caption="Group">
            <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
              <small>#</small>{batchIndex + 1}
            </Tag>
          </TimingColumn>

          <TimingColumn caption="Group lifetime">
            <Block padding="3px">
              <Timer timout={generationLifetimeMs} version={batchVersion} />
            </Block>
          </TimingColumn>

          <TimingColumn caption="World age">
            <Block padding="3px">
              <Timer version={`${generationIndex}`} />
            </Block>
          </TimingColumn>

        </Block>
      </Notification>
    </Block>
  );
}

type TimingColumnProps = {
  caption: string,
  children: React.ReactNode,
};

function TimingColumn(props: TimingColumnProps) {
  const {caption, children} = props;
  return (
    <Block
      display="flex"
      flexDirection={['row', 'column', 'row']}
      alignItems="center"
      marginLeft="5px"
      marginRight="5px"
    >
      <Block
        marginRight={['5px', '0', '5px']}
        marginBottom={['0', '5px', '0']}
        color="black"
        $style={{textAlign: 'center'}}
      >
        {caption}:
      </Block>
      <Label3>
        {children}
      </Label3>
    </Block>
  );
}

export default EvolutionTiming;
