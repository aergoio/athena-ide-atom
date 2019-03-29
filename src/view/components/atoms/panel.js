'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const panelClass = 'athena-ide-tab-panel';

export default class Panel extends React.Component {

  static get propTypes() {
    return {
      children: PropTypes.element.isRequired
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={panelClass}>
        {this.props.children}
      </div>
    );
  }

}