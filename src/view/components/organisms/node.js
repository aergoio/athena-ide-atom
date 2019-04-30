import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { NodeSelect, Height } from '../molecules';
import { RemoveNodeModal, NewNodeModal } from './modals';

export const Node = (props) => {
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const onNodeChange = props.onNodeChange;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Node'/>
      </Row>
      <NodeSelect node={node} nodes={nodes} onChange={onNodeChange} />
      <Height height={height} />
      <Row class='components-row-button'>
        <RemoveNodeModal trigger={<Button name='Remove' />} />
        <NewNodeModal trigger={<Button name='New' class='component-btn-rightmost' />} />
      </Row>
    </ComponentsHolder>
  );
}

Node.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  height: PropTypes.number,
  onNodeChange: PropTypes.func
}

export default Node;