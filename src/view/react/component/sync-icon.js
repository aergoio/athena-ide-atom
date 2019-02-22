'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const syncIconClass = 'component-icon';

export default class SyncIcon extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.context,
      onClick: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = { context: props.context };
    if (props.onClick) {
      this.onClick = props.onClick.bind(this);
    }
  }

  render() {
    return (
      <div className={'inline-block icon-sync ' + syncIconClass} onClick={this.onClick}>
      </div>
    );
  }

}