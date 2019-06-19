import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, SelectBox } from '../atoms';

export const NodeSelect = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Node' />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <SelectBox
          value={props.node}
          options={props.nodes}
          onChange={props.onChange}
        />
      </CardItem>
    </CardRow>
  );
}

NodeSelect.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  onChange: PropTypes.func
}

export default NodeSelect;
