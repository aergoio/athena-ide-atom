import React from 'react'
import PropTypes from 'prop-types';
import { Row, Description, TextBox } from '../atoms';

export const Height = (props) => {
  return (
    <Row>
      <Description description='Height' />
      <TextBox text={props.height} />
    </Row>
  );
}

Height.propTypes = {
  height: PropTypes.string
}

export default Height;