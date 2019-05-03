import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, SelectBox } from '../atoms';

export const NodeSelect = (props) => {
  return (
    <CardRow>
      <Description description='Node' />
      <SelectBox
        value={props.node}
        options={props.nodes}
        onChange={props.onChange}
      />
    </CardRow>
  );
}

NodeSelect.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  onChange: PropTypes.func
}

export default NodeSelect;
