'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const NodeHeight = (props) => {
  return (
    <Row>
      <Description description='Height' />
      <TextBox class='component-textbox-number' text={props.height} />
    </Row>
  );
}

NodeHeight.propTypes = {
  height: PropTypes.string
}

export default NodeHeight;