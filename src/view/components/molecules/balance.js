import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Balance = (props) => {
  return (
    <Row>
      <Description description='Balance' />
      <TextBox text={props.balance} />
    </Row>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

export default Balance;