'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const testBoxClass = 'component-textbox';

export default class TextBox extends React.Component {

  static get propTypes() {
    return {
      text: PropTypes.string,
      class: PropTypes.class
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={join('inline-block', testBoxClass, this.props.class)}>
        {this.props.text}
      </div>
    );
  }

}