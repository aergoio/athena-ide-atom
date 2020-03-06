import React from 'react';
import Popup from 'reactjs-popup';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  CardRow, Description, InputBox, Button, FileInput,
  ModalSummary, ModalSubSummary,
} from '../../atoms';
import { CardTitle, RadioButtonGroup } from '../../molecules';

const keystoreType = "KeyStore";
const wifType = "Wallet Import Format";
const types = [ keystoreType, wifType ];

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
    this.state = {
      selected: keystoreType
    };

    this.keyStoreInputRef = React.createRef();
    this.privateKeyInputRef = React.createRef();
    this.passwordInputRef = React.createRef();

    this._onSelectType = this._onSelectType.bind(this);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onSelectType(item) {
    logger.debug("select type", item);
    this.setState({
      selected: item
    });
  }

  _onConfirm() {
    const selected = this.state.selected;
    const password = this.passwordInputRef.current.value;
    if (selected === keystoreType) {
      const file = this.keyStoreInputRef.current.value;
      this._readFile(file).then(json => {
        logger.debug("json", json);
        this.props.accountStore.addAccountWithKeyStore(json, password);
      })
    } else {
      const encryptedPrivateKey = this.privateKeyInputRef.current.value;
      this.props.accountStore.addAccount(encryptedPrivateKey, password);
    }
  }

  _readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new global.FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(file) ;
      reader.onerror = (e) => reject(e);
  })}

  render() {
    const selected = this.state.selected;
    const items = types;
    const onSelect = this._onSelectType;

    let selectedType;
    if (this.state.selected === keystoreType) {
      selectedType = (
        <CardRow>
          <Description description='File path' />
          <FileInput ref={this.keyStoreInputRef} />
        </CardRow>
      );
    } else { // wif type
      selectedType = (
        <CardRow>
          <Description description='Private key' />
          <InputBox ref={this.privateKeyInputRef} type='text'
              placeHolder='encrypted private key'/>
        </CardRow>
      );
    }

    return (
      <Popup modal trigger={<Button class='component-btn-ocean' name='Import' />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Import Account' />
              <CardRow class='component-card-row-border' />
              <CardRow>
                <ModalSummary content='Are you sure you want to import account?' />
              </CardRow>
              <CardRow>
                <ModalSubSummary content='To import, please configure an import type and password.' />
              </CardRow>
              <CardRow>
                <Description description='Type' />
                <RadioButtonGroup selected={selected} items={items} name='import_type' onSelect={onSelect}/>
              </CardRow>
              {selectedType}
              <CardRow>
                <Description description='Password' />
                <InputBox ref={this.passwordInputRef} type='password'
                    placeHolder='password to decrypt encrypted private key'/>
              </CardRow>
              <CardRow class='component-card-row-button-modal'>
                <Button name='Cancel' onClick={close}/>
                <Button class='component-btn-rightmost' name='Import'
                    onClick={() => { this._onConfirm(); close(); }} />
              </CardRow>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
