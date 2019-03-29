'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

export const FileSelect = (props) => {
  return (
    <Row>
      <Description description="File" />
      <SelectBox
        value={props.file}
        options={props.files}
        onChange={props.onChange}
      />
    </Row>
  );
}

FileSelect.propTypes = {
  file: PropTypes.string,
  files: PropTypes.array,
  onChange: PropTypes.func
}

export default FileSelect;