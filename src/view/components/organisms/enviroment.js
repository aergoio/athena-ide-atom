'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, SyncIcon, Button } from '../atoms';
import { NodeSelect, NodeHeight } from '../molecules';
import { NewNodeModal, RemoveNodeModal } from './modals';

export const Enviroment = (props) => {
  const onSyncNode = props.onSyncNode;
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const onNodeChange = props.onNodeChange;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Enviroment'/>
        <SyncIcon onClick={onSyncNode} />
      </Row>
      <NodeSelect node={node} nodes={nodes} onChange={onNodeChange} />
      <NodeHeight height={height} />
      <Row class='components-row-button'>
        <NewNodeModal trigger={<Button name='New' />} />
        <RemoveNodeModal trigger={<Button name='Remove' />} />
      </Row>
    </ComponentsHolder>
  );
}

Enviroment.propTypes = {
  onSyncNode: PropTypes.func,
  node: PropTypes.string,
  nodes: PropTypes.array,
  height: PropTypes.number,
  onNodeChange: PropTypes.func
}

export default Enviroment;