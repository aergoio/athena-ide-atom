'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

export const TargetSelect = (props) => {
  return (
    <Row>
      <Description description="Target" />
      <SelectBox
        value={props.target}
        options={props.targets}
        onChange={props.onChange}
      />
    </Row>
  );
}

TargetSelect.propTypes = {
  target: PropTypes.string,
  targets: PropTypes.array,
  onChange: PropTypes.func
}

export default TargetSelect;