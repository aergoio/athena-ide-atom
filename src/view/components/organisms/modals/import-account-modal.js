'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Description, InputBox, Button} from '../../atoms';

@inject('accountStore')
@observer
export default class ImportAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.state = { encryptedPrivateKey: "", password: "" };

    this.encryptedPrivateKeyRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  _onConfirm() {
    const encryptedPrivateKey = this.encryptedPrivateKeyRef.current.state.value;
    const password = this.passwordRef.current.state.value;
    logger.debug("Import account confirm button clicked with", encryptedPrivateKey);
    this.props.accountStore.addAccount(encryptedPrivateKey, password);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
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
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
