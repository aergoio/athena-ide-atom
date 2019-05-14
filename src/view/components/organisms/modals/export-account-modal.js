import React from 'react';
import Popup from 'reactjs-popup';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { CardRow, Description, InputBox, Button } from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('accountStore')
@observer
export default class ExportAccountModal extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
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
      <Popup modal trigger={<Button name='Export' />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Enter password to decrypt private key' />
              <CardRow>
                <Description description='Password' />
                <InputBox ref={this.passwordInputRef} type='text'
                    placeHolder='password to encrypt private key'/>
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
