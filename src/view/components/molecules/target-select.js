'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

export const TargetSelect = (props) => {
  return (
    <Row>
      <Description description="Target" />
      <SelectBox
        value={props.file}
        options={props.files}
        onChange={props.onChange}
      />
    </Row>
  );
}

TargetSelect.propTypes = {
  file: PropTypes.string,
  files: PropTypes.array,
  onChange: PropTypes.func
}

export default TargetSelect;