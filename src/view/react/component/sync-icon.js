'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const syncIconClass = 'component-icon';

export default class SyncIcon extends React.Component {

  static get propTypes() {
    return {
      onClick: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={join('inline-block', 'icon-sync', syncIconClass)}
        onClick={this.props.onClick}>
      </div>
    );
  }

}