import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, TextBox } from '../atoms';

export const Nonce = (props) => {
  return (
    <CardRow>
      <Description description='Nonce' />
      <TextBox text={props.nonce} />
    </CardRow>
  );
};

Nonce.propTypes = {
  nonce: PropTypes.string
}

export default Nonce;
