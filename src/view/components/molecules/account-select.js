import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, SelectBox } from '../atoms';

export const AddressSelect = (props) => {
  return (
    <CardRow>
      <Description description='Address' />
      <SelectBox
        value={props.address}
        options={props.addresses}
        onChange={props.onChange}
      />
    </CardRow>
  );
};

AddressSelect.propTypes = {
  address : PropTypes.string,
  addresses : PropTypes.array,
  onChange: PropTypes.func
}

export default AddressSelect;
