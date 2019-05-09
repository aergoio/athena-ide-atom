import React from 'react'
import PropTypes from 'prop-types';

import { CardRow } from '../atoms';
import { CardTitle, FoldableCard, NodeSelect, Height } from '../molecules';
import { RemoveNodeModal, NewNodeModal } from './modals';

export const Node = (props) => {
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const onNodeChange = props.onNodeChange;

  return (
    <FoldableCard trigger={<CardTitle title='Node' />}>
      <NodeSelect node={node} nodes={nodes} onChange={onNodeChange} />
      <Height height={height} />
      <CardRow class='card-row-button'>
        <RemoveNodeModal />
        <NewNodeModal />
      </CardRow>
    </FoldableCard>
  );
}

Node.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  height: PropTypes.number,
  onNodeChange: PropTypes.func
}

export default Node;
