import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, InputBox } from '../atoms';

export const GasLimit = (props) => {
  const ref = props.limitRef;
  const onChange = props.onLimitChange;
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Gas Limit' />
      </CardItem>
      <CardItem ratio={1}>
        <InputBox ref={ref} onChange={onChange} type='number' />
      </CardItem>
    </CardRow>
  );
};

GasLimit.propTypes = {
  limitRef: PropTypes.object,
  onLimitChange: PropTypes.func,
}

export default GasLimit;
