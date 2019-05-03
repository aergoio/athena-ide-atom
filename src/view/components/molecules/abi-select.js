import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, SelectBox } from '../atoms';

const AbiSelect = (props) => {
  return (
    <CardRow>
      <Description description='ABI' />
      <SelectBox
        value={props.currentContract}
        options={props.contracts}
        onChange={props.onChange}
      />
    </CardRow>
  );
}

AbiSelect.propTypes = {
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onChange: PropTypes.func
}

export default AbiSelect;
