import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { CardRow, Button } from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('accountStore')
@observer
export default class RemoveAccountModal extends React.Component {

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
    logger.debug("Remove account confirm button clicked");
    const currentAddress = this.props.accountStore.currentAddress;
    this.props.accountStore.removeAccount(currentAddress);
  }

  render() {
    const disabled = "" === this.props.accountStore.currentAddress;
    return (
      <Popup modal trigger={<Button name='Remove' disabled={disabled} />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Do you want to remove current account?' />
              <CardRow class='card-row-button-modal'>
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
