import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox } from '../atoms';

export const Nonce = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Nonce' />
      </CardItem>
      <CardItem ratio={1}>
        <TextBox text={props.nonce} />
      </CardItem>
    </CardRow>
  );
};

Nonce.propTypes = {
  nonce: PropTypes.string
}

export default Nonce;
