import React from 'react';
import { Block } from 'baseui/block';

type FormElementsRowProps = {
  nodes: React.ReactNode[],
  buttons?: React.ReactNode,
  alignBottom?: boolean,
};

const marginX = '10px';

const FormElementsRow = (props: FormElementsRowProps) => {
  const {nodes, buttons, alignBottom = false} = props;

  const rows = nodes.map((node: React.ReactNode, nodeIndex: number) => {
    const marginLeft = nodeIndex === 0 ? 0 : marginX;
    const marginRight = nodeIndex === (nodes.length - 1) && !buttons ? 0 : marginX;

    return (
      <Block
        key={nodeIndex}
        display="flex"
        flex={1}
        marginLeft={[0, marginLeft, marginLeft]}
        marginRight={[0, marginRight, marginRight]}
        flexDirection="column"
        justifyContent="flex-end"
      >
        {node}
      </Block>
    );
  });

  const buttonsRow = buttons ? (
    <Block
      display="flex"
      marginLeft={[0, marginX, marginX]}
      flexDirection="column"
      justifyContent="flex-end"
    >
      {buttons}
    </Block>
  ) : null;

  const alignItems = alignBottom ? 'flex-end' : 'flex-start';

  return (
    <Block
      display="flex"
      flex={1}
      flexDirection={['column', 'row', 'row']}
      alignItems={['stretch', alignItems, alignItems]}
      justifyContent="center"
    >
      {rows}
      {buttonsRow}
    </Block>
  );
};

export default FormElementsRow;
