'use babel';

import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {

  static get propTypes() { 
    return { 
      name: PropTypes.string
    }; 
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='btn'>{this.props.name}</div>
    );
  }

}