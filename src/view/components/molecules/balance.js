'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Balance = (props) => {
  return (
    <Row>
      <Description description='Balance' />
      <TextBox class='component-textbox-number' text={props.balance} />
    </Row>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

export default Balance;