import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, TextBox } from '../atoms';

export const Payload = (props) => {
  return (
    <CardRow>
      <Description description="Payload" />
      <TextBox class='component-textbox-compile-result' text={props.payload} />
    </CardRow>
  );
}

Payload.propTypes = {
  payload: PropTypes.string
}

export default Payload;
