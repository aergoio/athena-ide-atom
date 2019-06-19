import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, SelectBox, CopyIcon } from '../atoms';

export const AddressSelect = (props) => {
  const accountAddress = props.address;
  const accountAddresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Address' />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <SelectBox
          value={accountAddress}
          options={accountAddresses}
          onChange={onAddressChange}
        />
      </CardItem>
      <CardItem ratio={0}>
        <CopyIcon onClick={(e) => { e.stopPropagation(); onAddressCopy(accountAddress)} } />
      </CardItem>
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
