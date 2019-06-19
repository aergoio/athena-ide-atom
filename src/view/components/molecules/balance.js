import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox } from '../atoms';

export const Balance = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Balance' />
      </CardItem>
      <CardItem ratio={1}>
        <TextBox text={props.balance} />
      </CardItem>
    </CardRow>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

export default Balance;
