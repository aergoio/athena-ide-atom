'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const titleClass = 'component-title';

export default class Description extends React.Component {

  static get propTypes() { 
    return { 
      title: PropTypes.string
    }; 
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={join('inline-block', titleClass)}>
        {this.props.title}
      </div>
    );
  }

}