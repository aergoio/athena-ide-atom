import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, SelectBox } from '../atoms';

export const ContractSelect = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description="Contract" />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <SelectBox
          value={props.contract}
          options={props.contracts}
          onChange={props.onChange}
          placeholder={"select contract if you want to redeploy"}
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
