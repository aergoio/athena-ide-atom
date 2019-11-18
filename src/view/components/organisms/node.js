import React from 'react'
import { Flex } from 'reflexbox';
import PropTypes from 'prop-types';

import { Title, Card, Description, CardRow, SyncIcon } from '../atoms';
import { NodeSelect, Height, GasPrice } from '../molecules';
import { RemoveNodeModal, NewNodeModal } from './modals';

export const Node = (props) => {
  const onSync = props.onSync;
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const price = props.gasPrice;
  const onNodeChange = props.onNodeChange;

  return (
    <Card>
      <CardRow>
        <Title title='Node' />
        <Flex justify='flex-end' w={1}>
          <SyncIcon onClick={onSync} />
        </Flex>
      </CardRow>
      <NodeSelect node={node} nodes={nodes} onChange={onNodeChange} />
      <Height height={height} />
      <GasPrice price={price} />
      <CardRow>
        <Description description='' />
        <Flex justify='flex-end' w={1}>
          <RemoveNodeModal />
          <NewNodeModal />
        </Flex>
      </CardRow>
    </Card>
  );
}

Node.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  height: PropTypes.number,
  gasPrice: PropTypes.number,
  onSync: PropTypes.func,
  onNodeChange: PropTypes.func
}

export default Node;
