import React from 'react';
import Popup from 'reactjs-popup';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { CardRow, Description, InputBox, Button } from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('accountStore')
@observer
export default class ImportAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this.privateKeyInputRef = React.createRef();
    this.passwordInputRef = React.createRef();
  }

  _onConfirm() {
    const encryptedPrivateKey = this.privateKeyInputRef.current.value;
    const password = this.passwordInputRef.current.value;
    logger.debug("Import account confirm button clicked with", encryptedPrivateKey);
    this.props.accountStore.addAccount(encryptedPrivateKey, password);
  }

  render() {
    return (
      <Popup modal trigger={<Button class='component-btn-ocean' name='Import' />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Import account with encrypted private key' />
              <CardRow>
                <Description description='Private key' />
                <InputBox ref={this.privateKeyInputRef} type='text'
                    placeHolder='encrypted private key'/>
              </CardRow>
              <CardRow>
                <Description description='Password' />
                <InputBox ref={this.passwordInputRef} type='text'
                    placeHolder='password to decrypt encrypted private key'/>
              </CardRow>
              <CardRow class='card-row-button-modal'>
                <Button name='Cancel' onClick={close}/>
                <Button class='component-btn-rightmost' name='Ok' onClick={() => { this._onConfirm(); close(); }} />
              </CardRow>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
