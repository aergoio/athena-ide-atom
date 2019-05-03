import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, SelectBox } from '../atoms';

export const TargetSelect = (props) => {
  return (
    <CardRow>
      <Description description="Target" />
      <SelectBox
        value={props.target}
        options={props.targets}
        onChange={props.onChange}
      />
    </CardRow>
  );
}

TargetSelect.propTypes = {
  target: PropTypes.string,
  targets: PropTypes.array,
  onChange: PropTypes.func
}

export default TargetSelect;
