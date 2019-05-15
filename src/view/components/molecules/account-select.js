import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, SelectBox, CopyIcon } from '../atoms';

export const AddressSelect = (props) => {
  const accountAddress = props.address;
  const accountAddresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  return (
    <CardRow>
      <Description description='Address' />
      <SelectBox
        value={accountAddress}
        options={accountAddresses}
        onChange={onAddressChange}
      />
      <CopyIcon onClick={(e) => { e.stopPropagation(); onAddressCopy(accountAddress)} } />
    </CardRow>
  );
};

AddressSelect.propTypes = {
  address : PropTypes.string,
  addresses : PropTypes.array,
  onAddressChange: PropTypes.func,
  onAddressCopy: PropTypes.func
}

export default AddressSelect;
