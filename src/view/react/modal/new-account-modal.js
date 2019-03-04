'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {ComponentsHolder, Row, Title, Button} from '../components';

export default class NewAccountModal extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
  }

  _onConfirm() {
    logger.debug("New account confirm button clicked");
    this.props.context.services.accountService.newAccount();
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <ComponentsHolder>
              <Row>
                <Title title='Do you want to make a new account?' />
              </Row>
              <Row class='components-row-button'>
                <Button name='Ok' onClick={() => { this._onConfirm(); close(); }} />
                <Button name='Cancel' onClick={close}/>
              </Row>
            </ComponentsHolder>
          </atom-panel>
        }
      </Popup>
    );
  }

}