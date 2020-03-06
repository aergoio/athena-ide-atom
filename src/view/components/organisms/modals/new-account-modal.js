import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  CardRow, Button,
  ModalSummary, ModalSubSummary,
} from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('accountStore')
@observer
export default class NewAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("New account confirm button clicked");
    this.props.accountStore.newAccount();
  }

  render() {
    return (
      <Popup modal trigger={<Button name='New' class='component-btn-rightmost' />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='New Account' />
              <CardRow class='component-card-row-border' />
              <CardRow>
                <ModalSummary content='Do you want to make a new account?' />
              </CardRow>
              <CardRow>
                <ModalSubSummary content='WARNING: IDE DOES NOT keep created account.' />
              </CardRow>
              <CardRow class='component-card-row-button-modal'>
                <Button name='Cancel' onClick={close}/>
                <Button name='Ok' class='component-btn-rightmost' onClick={() => { this._onConfirm(); close(); }} />
              </CardRow>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
