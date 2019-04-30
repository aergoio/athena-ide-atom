import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Abi = (props) => {
  return (
    <Row>
      <Description description="ABI" />
      <TextBox class='component-textbox-compile-result' text={props.abi} />
    </Row>
  );
}

Abi.propTypes = {
  abi: PropTypes.string
}

export default Abi;