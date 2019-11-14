import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox } from '../atoms';
import { convertAerPretty } from '../../../utils';

export const Balance = (props) => {
  const balance = convertAerPretty(props.balance);
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Balance' />
      </CardItem>
      <CardItem ratio={1}>
        <TextBox text={balance} />
      </CardItem>
    </CardRow>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

export default Balance;
