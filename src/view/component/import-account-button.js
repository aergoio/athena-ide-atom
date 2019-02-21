'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import Title from './title';
import Description from './description';
import InputBox from './input-box';
import Button from './button';
import PropTypes from 'prop-types';
import logger from '../../logger';

export default class ImportAccountButton extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = { encryptedPrivateKey: "", passwordToDecrypt: "" };
  }

  _updateEncryptedPrivateKey(e) {
    this.setState({encryptedPrivateKey: e.target.value});
  }

  _updatePasswordToDecrypt(e) {
    this.setState({passwordToDecrypt: e.target.value});
  }

  _onConfirm() {
    const encryptedPrivateKey = this.state.encryptedPrivateKey;
    const passwordToDecrypt = this.state.passwordToDecrypt;
    this.props.context.services.accountService.importAccount(encryptedPrivateKey, passwordToDecrypt);
  }

  render() {
    return (
      <Popup modal trigger={<Button name='Import' />}>
        {close =>
          <div className='components-holder'>
            <div className='components-row'>
              <Title class='' title='Import account with encrypted private key' />
            </div>
            <div className='components-row'>
              <Description description='Private key' />
              <InputBox onChange={(e) => this._updateEncryptedPrivateKey(e)} type='text'
                  placeHolder='encrypted private key'/>
            </div>
            <div className='components-row'>
              <Description description='Password' />
              <InputBox onChange={(e) => this._updatePasswordToDecrypt(e)} type='text'
                  placeHolder='password to decrypt encrypted private key'/>
            </div>
            <div className='components-row components-row-button'>
              <Button name='Ok' onClick={() => { this._onConfirm(); close(); }} />
              <Button name='Cancel' onClick={close}/>
            </div>
          </div>
        }
      </Popup>
    );
  }

}