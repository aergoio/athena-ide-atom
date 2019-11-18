import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox } from '../atoms';
import { formatInteger } from '../../../utils';

export const Height = (props) => {
  const height = formatInteger(props.height);
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Height' />
      </CardItem>
      <CardItem ratio={1}>
        <TextBox text={height} />
      </CardItem>
    </CardRow>
  );
}

Height.propTypes = {
  height: PropTypes.string
}

export default Height;
