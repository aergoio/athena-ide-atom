import React from 'react'
import PropTypes from 'prop-types';

import { CardRow } from '../atoms';
import { FoldableCard, CardTitle, AccountSelect, Balance, Nonce } from '../molecules';
import { RemoveAccountModal, ImportAccountModal, ExportAccountModal, NewAccountModal } from './modals';

export const Account = (props) => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const balance = props.balance;
  const nonce = props.nonce;

  return (
    <FoldableCard trigger={<CardTitle title='Account' />}>
      <AccountSelect address={address} addresses={addresses} onChange={onAddressChange} />
      <Balance balance={balance} />
      <Nonce nonce={nonce} />
      <CardRow class='card-row-button'>
        <RemoveAccountModal />
        <ImportAccountModal />
        <ExportAccountModal />
        <NewAccountModal />
      </CardRow>
    </FoldableCard>
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