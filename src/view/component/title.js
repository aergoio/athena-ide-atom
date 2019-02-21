'use babel';

import React from 'react';
import PropTypes from 'prop-types';

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

  _join() {
    return Array.from(arguments).reduce((acc, val) => acc.concat(val), []).join(' ');
  }

  render() {
    return (
      <div className={this._join('inline-block', titleClass)}>
        {this.props.title}
      </div>
    );
  }

}