import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Button} from '../../atoms';

@inject('accountStore')
@observer
export default class NewAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      trigger: PropTypes.element
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
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <Row>
                <Title title='Do you want to make a new account?' />
              </Row>
              <Row class='components-row-button'>
                <Button name='Cancel' onClick={close}/>
                <Button name='Ok' class='component-btn-rightmost' onClick={() => { this._onConfirm(); close(); }} />
              </Row>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}