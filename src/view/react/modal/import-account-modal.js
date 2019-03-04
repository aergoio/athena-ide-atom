'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {ComponentsHolder, Row, Title, Description, InputBox, Button} from '../components';

export default class ImportAccountModal extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.state = { encryptedPrivateKey: "", passwordToDecrypt: "" };

    this.encryptedPrivateKeyRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  _onConfirm() {
    const encryptedPrivateKey = this.encryptedPrivateKeyRef.current.state.value;
    const passwordToDecrypt = this.passwordRef.current.state.value;
    logger.debug("Import account confirm button clicked with", encryptedPrivateKey);
    this.props.context.services.accountService.importAccount(encryptedPrivateKey, passwordToDecrypt);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <ComponentsHolder>
              <Row>
                <Title title='Import account with encrypted private key' />
              </Row>
              <Row>
                <Description description='Private key' />
                <InputBox ref={this.encryptedPrivateKeyRef} type='text'
                    placeHolder='encrypted private key'/>
              </Row>
              <Row>
                <Description description='Password' />
                <InputBox ref={this.passwordRef} type='text'
                    placeHolder='password to decrypt encrypted private key'/>
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
