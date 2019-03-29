'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

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
      <div className={join('inline-block', 'highlight-info', descriptionClass)}>
        {this.props.description}
      </div>
    );
  }

}