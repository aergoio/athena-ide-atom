import React from 'react'
import { Flex, Box } from 'reflexbox';
import PropTypes from 'prop-types';

import { Description, CardRow } from '../atoms';
import { FoldableCard, CardTitle, AccountSelect, Balance, Nonce } from '../molecules';
import { ImportAccountModal, ExportAccountModal, RemoveAccountModal, NewAccountModal } from './modals';

export const Account = (props) => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  const balance = props.balance;
  const nonce = props.nonce;

  return (
    <FoldableCard trigger={<CardTitle title='Account' />}>
      <AccountSelect address={address} addresses={addresses} onAddressChange={onAddressChange} onAddressCopy={onAddressCopy} />
      <Balance balance={balance} />
      <Nonce nonce={nonce} />
      <CardRow>
        <Description description='' />
        <Flex justify='space-between' w={1}>
          <Box>
            <ImportAccountModal />
            <ExportAccountModal />
          </Box>
          <Box>
            <RemoveAccountModal />
            <NewAccountModal />
          </Box>
        </Flex>
      </CardRow>
    </FoldableCard>
  );
};

Account.propTypes = {
  address: PropTypes.string,
  addresses: PropTypes.array,
  onAddressChange: PropTypes.func,
  onAddressCopy: PropTypes.func,
  balance: PropTypes.number,
  nonce: PropTypes.number
}

export default Account;