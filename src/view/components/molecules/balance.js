import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, TextBox } from '../atoms';

export const Balance = (props) => {
  return (
    <CardRow>
      <Description description='Balance' />
      <TextBox text={props.balance} />
    </CardRow>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

export default Balance;
