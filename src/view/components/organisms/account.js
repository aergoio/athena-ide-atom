import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, SyncIcon, Button } from '../atoms';
import { AccountSelect, Balance, Nonce } from '../molecules';
import { NewAccountModal, ImportAccountModal, ExportAccountModal } from './modals';

export const Account = (props) => {
  const onSyncAccount= props.onSyncAccount;
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const balance = props.balance;
  const nonce = props.nonce;

  return (
    <ComponentsHolder>
      <Row>
        <Title title='Account'/>
        <SyncIcon onClick={onSyncAccount} />
      </Row>
      <AccountSelect address={address} addresses={addresses} onChange={onAddressChange} />
      <Balance balance={balance} />
      <Nonce nonce={nonce} />
      <Row class='components-row-button'>
        <NewAccountModal trigger={<Button name='New' />} />
        <ImportAccountModal trigger={<Button name='Import' />} />
        <ExportAccountModal trigger={<Button name='Export' />} />
      </Row>
    </ComponentsHolder>
  );
};

Account.propTypes = {
  onSyncAccount: PropTypes.func,
  address: PropTypes.string,
  addresses: PropTypes.array,
  onAddressChange: PropTypes.func,
  balance: PropTypes.number,
  nonce: PropTypes.number
}

export default Account;