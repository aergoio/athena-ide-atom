import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Payload = (props) => {
  return (
    <Row>
      <Description description="Payload" />
      <TextBox text={props.payload} />
    </Row>
  );
}

Payload.propTypes = {
  payload: PropTypes.string
}

export default Payload;