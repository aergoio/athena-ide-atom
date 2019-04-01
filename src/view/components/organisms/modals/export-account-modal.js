'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Description, InputBox, Button} from '../../atoms';

@inject('accountStore')
@observer
export default class ExportAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.passwordInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Export account button clicked");
    const password = this.passwordInputRef.current.value;
    this.props.accountStore.exportAccount(password);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <Row>
                <Title title='Enter password to decrypt private key' />
              </Row>
              <Row>
                <Description description='Password' />
                <InputBox ref={this.passwordInputRef} type='text'
                    placeHolder='password to encrypt private key'/>
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
