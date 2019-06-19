import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, SelectBox } from '../atoms';

export const TargetSelect = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description="Target" />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <SelectBox
          value={props.target}
          options={props.targets}
          onChange={props.onChange}
        />
      </CardItem>
    </CardRow>
  );
}

TargetSelect.propTypes = {
  target: PropTypes.string,
  targets: PropTypes.array,
  onChange: PropTypes.func
}

export default TargetSelect;
