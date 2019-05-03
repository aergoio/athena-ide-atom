import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, TextBox } from '../atoms';

export const Height = (props) => {
  return (
    <CardRow>
      <Description description='Height' />
      <TextBox text={props.height} />
    </CardRow>
  );
}

Height.propTypes = {
  height: PropTypes.string
}

export default Height;
