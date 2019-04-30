import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { AccountSelect, Balance, Nonce } from '../molecules';
import { ImportAccountModal, ExportAccountModal, NewAccountModal } from './modals';

export const Account = (props) => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const balance = props.balance;
  const nonce = props.nonce;

  return (
    <ComponentsHolder>
      <Row>
        <Title title='Account'/>
      </Row>
      <AccountSelect address={address} addresses={addresses} onChange={onAddressChange} />
      <Balance balance={balance} />
      <Nonce nonce={nonce} />
      <Row class='components-row-button'>
        <ImportAccountModal trigger={<Button name='Import' />} />
        <ExportAccountModal trigger={<Button name='Export' />} />
        <NewAccountModal trigger={<Button name='New' class='component-btn-rightmost' />} />
      </Row>
    </ComponentsHolder>
  );
};

Account.propTypes = {
  address: PropTypes.string,
  addresses: PropTypes.array,
  onAddressChange: PropTypes.func,
  balance: PropTypes.number,
  nonce: PropTypes.number
}

export default Account;