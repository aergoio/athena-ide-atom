'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Title, Description, InputBox, Button} from '../component';

export default class ImportAccountButton extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
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
      <Popup modal trigger={<Button name='Import' />}>
        {close =>
          <atom-panel class='modal'>
            <div className='components-holder'>
              <div className='components-row'>
                <Title class='' title='Import account with encrypted private key' />
              </div>
              <div className='components-row'>
                <Description description='Private key' />
                <InputBox ref={this.encryptedPrivateKeyRef} type='text'
                    placeHolder='encrypted private key'/>
              </div>
              <div className='components-row'>
                <Description description='Password' />
                <InputBox ref={this.passwordRef} type='text'
                    placeHolder='password to decrypt encrypted private key'/>
              </div>
              <div className='components-row components-row-button'>
                <Button name='Ok' onClick={() => { this._onConfirm(); close(); }} />
                <Button name='Cancel' onClick={close}/>
              </div>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
