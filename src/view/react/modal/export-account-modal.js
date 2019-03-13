'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {ComponentsHolder, Row, Title, Description, InputBox, Button} from '../components';

@inject('accountStore')
@observer
export default class ExportAccountModal extends React.Component {

  static get propTypes() {
    return {
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
    this._updatePassword = this._updatePassword.bind(this);
  }

  _updatePassword(e) {
    this.setState({ password: e.target.value });
  }

  _onConfirm() {
    logger.debug("Export account button clicked");
    const password = this.state.password;
    this.props.accountStore.exportAccount(password);
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
                <InputBox onChange={this._updatePassword} type='text'
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
