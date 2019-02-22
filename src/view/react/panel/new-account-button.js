'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';

import {Title, Button} from '../component';

export default class NewAccountButton extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
  }

  _onConfirm() {
    this.props.context.services.accountService.newAccount();
  }

  render() {
    return (
      <Popup modal trigger={<Button name='New' />}>
        {close =>
          <atom-panel class='modal'>
            <div className='components-holder'>
              <div className='components-row'>
                <Title class='' title='Do you want to make a new account?' />
              </div>
              <div className='components-row components-row-button'>
                <Button name='Ok' onClick={() => { this._onConfirm(); close(); }} />
                <Button name='Cancel' onClick={close}/>
              </div>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}