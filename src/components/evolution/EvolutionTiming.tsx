import React from 'react';
import { Label3 } from 'baseui/typography';
import {Tag, VARIANT as TAG_VARIANT} from 'baseui/tag';
import { Block } from 'baseui/block';
import {Notification, KIND as NOTIFICATION_KIND} from 'baseui/notification';
import { VscDebugRestart } from 'react-icons/all';

import Timer from '../shared/Timer';

type EvolutionTimingProps = {
  generationIndex?: number | null,
  totalBatches?: number | null,
  batchIndex?: number | null,
  generationLifetimeMs?: number,
  batchVersion?: string,
  worldVersion?: string,
  retry?: boolean,
  groupLabel?: string,
  batchLifetimeLabel?: string,
};

function EvolutionTiming(props: EvolutionTimingProps) {
  const {
    generationIndex,
    batchIndex,
    totalBatches,
    generationLifetimeMs,
    batchVersion,
    worldVersion,
    retry = false,
    groupLabel = 'Group',
    batchLifetimeLabel = 'Group lifetime',
  } = props;

  const batchesCounter = retry ? (
    <Block marginBottom="-2px">
      <VscDebugRestart title="Retrying the first group since the loss value increased" />
    </Block>
  ) : (
    <>
      <small>#</small>{(batchIndex || 0) + 1}
      {totalBatches && (<span> / {totalBatches}</span>)}
    </>
  );

  const generationInfo = generationIndex !== undefined ? (
    <TimingColumn caption="Generation">
      <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
        <small>#</small>{(generationIndex || 0) + 1}
      </Tag>
    </TimingColumn>
  ) : null;

  const groupInfo = batchIndex !== undefined ? (
    <TimingColumn caption={groupLabel}>
      <Tag closeable={false} variant={TAG_VARIANT.solid} kind="neutral">
        {batchesCounter}
      </Tag>
    </TimingColumn>
  ) : null;

  const groupLifetime = generationLifetimeMs !== undefined && batchVersion !== undefined ? (
    <TimingColumn caption={batchLifetimeLabel}>
      <Block padding="3px">
        <Timer timeout={generationLifetimeMs} version={batchVersion} />
      </Block>
    </TimingColumn>
  ) : null;

  const worldAge = worldVersion !== undefined ? (
    <TimingColumn caption="World age">
      <Block padding="3px">
        <Timer version={worldVersion} />
      </Block>
    </TimingColumn>
  ) : null;

  return (
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
        alignItems={['flex-start', 'flex-end', 'center']}
        justifyContent="space-between"
        width="auto"
        flex="1"
      >
        {generationInfo}
        {groupInfo}
        {groupLifetime}
        {worldAge}
      </Block>
    </Notification>
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
