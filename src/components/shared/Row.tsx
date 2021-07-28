import React from 'react';
import { Block } from 'baseui/block';

type RowProps = {
  children: React.ReactNode,
};

const Row = (props: RowProps) => {
  const {children} = props;

  return (
    <Block
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Block>
  );
};

export default Row;
