import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Payload = (props) => {
  return (
    <Row>
      <Description description="Payload" />
      <TextBox class='component-textbox-compile-result' text={props.payload} />
    </Row>
  );
}

Payload.propTypes = {
  payload: PropTypes.string
}

export default Payload;