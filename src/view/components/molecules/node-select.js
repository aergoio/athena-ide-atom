import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

export const NodeSelect = (props) => {
  return (
    <Row>
      <Description description='Node' />
      <SelectBox
        value={props.node}
        options={props.nodes}
        onChange={props.onChange}
      />
    </Row>
  );
}

NodeSelect.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  onChange: PropTypes.func
}

export default NodeSelect;