'use babel'

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

const AbiSelect = (props) => {
  return (
    <Row>
      <Description description='ABI' />
      <SelectBox
        value={props.currentContract}
        options={props.contracts}
        onChange={props.onChange}
      />
    </Row>
  );
}

AbiSelect.propTypes = {
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onChange: PropTypes.func
}

export default AbiSelect;