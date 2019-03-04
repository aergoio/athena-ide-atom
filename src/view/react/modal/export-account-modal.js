'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {ComponentsHolder, Row, Title, Description, InputBox, Button} from '../components';

export default class ExportAccountModal extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any,
      trigger: PropTypes.element
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
    logger.debug("Export account button clicked with", accountAddress);
    this.props.context.services.accountService.exportAccount(accountAddress, passwordToEncrypt);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <ComponentsHolder>
              <Row>
                <Title title='Enter password to decrypt private key' />
              </Row>
              <Row>
                <Description description='Password' />
                <InputBox onChange={(e) => this._updatePasswordToEncrypt(e)} type='text'
                    placeHolder='password to encrypt private key'/>
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
