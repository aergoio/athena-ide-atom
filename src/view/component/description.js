'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const descriptionClass = 'component-description';

export default class Description extends React.Component {

  static get propTypes() { 
    return { 
      description: PropTypes.string
    }; 
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'inline-block highlight-info' + ' ' + descriptionClass}>
        {this.props.description}
      </div>
    );
  }

}