import React from 'react';
import Popup from 'reactjs-popup';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';
import fs from 'fs';

import {
  CardRow, Description, InputBox, Button,
  ModalSummary, ModalSubSummary,
} from '../../atoms';
import { CardTitle, RadioButtonGroup } from '../../molecules';

const keystoreType = "KeyStore";
const wifType = "Wallet Import Format";
const types = [ keystoreType, wifType ];
const KEYSTORE_POSTFIX = "__keystore.txt";

@inject('accountStore', 'consoleStore', 'notificationStore')
@observer
export default class ExportAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      consoleStore: PropTypes.any,
      notificationStore: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: keystoreType
    };
    this.passwordInputRef = React.createRef();

    this._onSelectType = this._onSelectType.bind(this);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onSelectType(item) {
    logger.debug("select", item);
    this.setState({
      selected: item
    });
  }

  _onConfirm(closeFunc) {
    const exportType = this.state.selected;
    logger.debug("Export account button clicked");
    logger.debug("Export type", exportType);
    const password = this.passwordInputRef.current.value;
    if (keystoreType === exportType) {
      this._exportAsKeyStore(password, closeFunc);
    } else { // default : Wallet import format
      this._exportAsWif(password, closeFunc);
    }
  }

  _exportAsKeyStore(password, closeFunc) {
    const filename = this.props.accountStore.currentAddress + KEYSTORE_POSTFIX;
    this.props.accountStore.encryptCurrentAsKeyStore(password).then(json => {
      const { remote } = require('electron');
      const dialog = remote.dialog;
      const win = remote.getCurrentWindow();
      const options = {
        title: "Save keystore file",
        defaultPath : filename,
        buttonLabel : "Save",
        filters :[
          {name: 'Keystores', extensions: ['txt']},
          {name: 'All Files', extensions: ['*']}
        ]
      }
      const savePath = dialog.showSaveDialog(win, options);
      if (savePath) {
        fs.writeFileSync(savePath, json);
        this.props.consoleStore.log("Exported:", "info");
        this.props.consoleStore.log(json, "info");
        this.props.notificationStore.notify("Exported account successfully", "success");
        closeFunc();
      }
    }).catch(err => {
      logger.error(err);
      this.props.consoleStore.log(err, "error");
      this.props.notificationStore.notify("Exporting account failed", "error");
      closeFunc();
    });
  }

  _exportAsWif(password, closeFunc) {
    this.props.accountStore.encryptCurrentAsWif(password).then(encrypted => {
      this.props.consoleStore.log("Exported:", "info");
      this.props.consoleStore.log(encrypted, "info");
      this.props.notificationStore.notify("Exported account successfully", "success");
      closeFunc();
    }).catch(err => {
      logger.error(err);
      this.props.consoleStore.log(err, "error");
      this.props.notificationStore.notify("Exporting account failed", "error");
      closeFunc();
    });
  }

  render() {
    const selected = this.state.selected;
    const items = types;
    const onSelect = this._onSelectType;
    const disabled = "" === this.props.accountStore.currentAddress;
    return (
      <Popup modal trigger={<Button class='component-btn-ocean' name='Export' disabled={disabled} />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Export Account' />
              <CardRow class='component-card-row-border' />
              <CardRow>
                <ModalSummary content='Are you sure you want to export account?' />
              </CardRow>
              <CardRow>
                <ModalSubSummary content='To export, please configure an import type and password.' />
              </CardRow>
              <CardRow>
                <Description description='Type' />
                <RadioButtonGroup selected={selected} items={items} name='export_type' onSelect={onSelect} />
              </CardRow>
              <CardRow>
                <Description description='Password' />
                <InputBox ref={this.passwordInputRef} type='password'
                    placeHolder='password to encrypt private key'/>
              </CardRow>
              <CardRow class='component-card-row-button-modal'>
                <Button name='Cancel' onClick={close}/>
                <Button class='component-btn-rightmost' name='Export'
                    onClick={() => this._onConfirm(close)} />
              </CardRow>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
