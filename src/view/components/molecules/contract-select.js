import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, SelectBox } from '../atoms';

// FIXME: hard coded one
const noContractComment = "No contract selected";

export const ContractSelect = (props) => {
  const contract = props.contract;
  const contracts = JSON.parse(JSON.stringify(props.contracts));
  if (contracts.length !== 0) {
    contracts.unshift(noContractComment); // add empty option
  }
  const onChange = props.onChange;
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description="Contract" />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <SelectBox
          value={contract}
          options={contracts}
          onChange={onChange}
          placeholder={"select contract to redeploy"}
        />
      </CardItem>
    </CardRow>
  );
}

ContractSelect.propTypes = {
  contract: PropTypes.string,
  contracts: PropTypes.array,
  onChange: PropTypes.func
}

export default ContractSelect;
