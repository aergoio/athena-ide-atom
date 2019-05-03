import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, TextBox } from '../atoms';

export const Abi = (props) => {
  return (
    <CardRow>
      <Description description="ABI" />
      <TextBox class='component-textbox-compile-result' text={props.abi} />
    </CardRow>
  );
}

Abi.propTypes = {
  abi: PropTypes.string
}

export default Abi;
