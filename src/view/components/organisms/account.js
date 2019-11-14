import React from 'react'
import { Flex, Box } from 'reflexbox';
import PropTypes from 'prop-types';

import { Description, CardRow } from '../atoms';
import { FoldableCard, CardTitle, AccountSelect, Balance, Nonce, GasPrice, GasLimit } from '../molecules';
import { ImportAccountModal, ExportAccountModal, RemoveAccountModal, NewAccountModal } from './modals';

export const Account = (props) => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  const balance = props.balance;
  const nonce = props.nonce;
  const price = props.price;
  const limitRef = React.createRef();
  const onLimitChange = props.onLimitChange;

  return (
    <FoldableCard trigger={<CardTitle title='Account' />}>
      <AccountSelect address={address} addresses={addresses} onAddressChange={onAddressChange} onAddressCopy={onAddressCopy} />
      <Flex w={1}>
        <Box w={2/3}>
          <Balance balance={balance} />
        </Box>
        <Box w={1/3}>
          <Nonce nonce={nonce} />
        </Box>
      </Flex>
      <GasPrice price={price} />
      <GasLimit limitRef={limitRef} onLimitChange={() => onLimitChange(limitRef.current.value)} />
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
  nonce: PropTypes.number,
  price: PropTypes.number,
  onLimitChange: PropTypes.func,
}

export default Account;