'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';

import {Title, Description, InputBox, Button} from '../component';

export default class ExportAccountButton extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      context: props.context,
      passwordToEncrypt: ""
    };
  }

  _updatePasswordToEncrypt(e) {
    this.setState({passwordToEncrypt: e.target.value});
  }

  _onConfirm() {
    const accountAddress = this.state.context.current.account.accountAddress;
    const passwordToEncrypt = this.state.passwordToEncrypt;
    this.props.context.services.accountService.exportAccount(accountAddress, passwordToEncrypt);
  }

  render() {
    return (
      <Popup modal trigger={<Button name='Export' />}>
        {close =>
          <atom-panel class='modal'>
            <div className='components-holder'>
              <div className='components-row'>
                <Title class='' title='Enter password to decrypt private key' />
              </div>
              <div className='components-row'>
                <Description description='Password' />
                <InputBox onChange={(e) => this._updatePasswordToEncrypt(e)} type='text'
                    placeHolder='password to encrypt private key'/>
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
