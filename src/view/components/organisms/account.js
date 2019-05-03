import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Title, Button } from '../atoms';
import { FoldableCard, AccountSelect, Balance, Nonce } from '../molecules';
import { ImportAccountModal, ExportAccountModal, NewAccountModal } from './modals';

export const Account = (props) => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const balance = props.balance;
  const nonce = props.nonce;

  const trigger = (
    <CardRow>
      <Title title='Account'/>
    </CardRow>
  );

  return (
    <FoldableCard trigger={trigger}>
      <AccountSelect address={address} addresses={addresses} onChange={onAddressChange} />
      <Balance balance={balance} />
      <Nonce nonce={nonce} />
      <CardRow class='card-row-button'>
        <ImportAccountModal trigger={<Button name='Import' />} />
        <ExportAccountModal trigger={<Button name='Export' />} />
        <NewAccountModal trigger={<Button name='New' class='component-btn-rightmost' />} />
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