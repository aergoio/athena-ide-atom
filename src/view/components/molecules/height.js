import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox } from '../atoms';

export const Height = (props) => {
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description='Height' />
      </CardItem>
      <CardItem ratio={1}>
        <TextBox text={props.height} />
      </CardItem>
    </CardRow>
  );
}

Height.propTypes = {
  height: PropTypes.string
}

export default Height;
