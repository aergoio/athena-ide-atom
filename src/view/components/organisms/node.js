import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Title, Button } from '../atoms';
import { FoldableCard, NodeSelect, Height } from '../molecules';
import { RemoveNodeModal, NewNodeModal } from './modals';

export const Node = (props) => {
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const onNodeChange = props.onNodeChange;

  const trigger = (
    <CardRow>
      <Title title='Node'/>
    </CardRow>
  );
  return (
    <FoldableCard trigger={trigger}>
      <NodeSelect node={node} nodes={nodes} onChange={onNodeChange} />
      <Height height={height} />
      <CardRow class='card-row-button'>
        <RemoveNodeModal trigger={<Button name='Remove' />} />
        <NewNodeModal trigger={<Button name='New' class='component-btn-rightmost' />} />
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
