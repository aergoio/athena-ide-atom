import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, SelectBox } from '../atoms';

export const AddressSelect = (props) => {
  return (
    <Row>
      <Description description='Address' />
      <SelectBox
        value={props.address}
        options={props.addresses}
        onChange={props.onChange}
      />
    </Row>
  );
};

AddressSelect.propTypes = {
  address : PropTypes.string,
  addresses : PropTypes.array,
  onChange: PropTypes.func
}

export default AddressSelect;