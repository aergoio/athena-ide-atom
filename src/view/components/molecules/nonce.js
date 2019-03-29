'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Nonce = (props) => {
  return (
    <Row>
      <Description description='Nonce' />
      <TextBox class='component-textbox-number' text={props.nonce} />
    </Row>
  );
};

Nonce.propTypes = {
  nonce: PropTypes.string
}

export default Nonce;