import React from 'react';
import Popup from 'reactjs-popup';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { CardRow, Description, InputBox, Button } from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('contractStore')
@observer
export default class NewNodeModal extends React.Component {

  static get propTypes() {
    return {
      contractStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.contractInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Add node button clicked");
    const contract = this.contractInputRef.current.value;
    this.props.contractStore.addContract(contract);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Enter contract address' />
              <CardRow>
                <Description description='Contract' />
                <InputBox ref={this.contractInputRef} type='text'
                    placeHolder='eg. Amg6TQrTd6f7dE67PBzv6vbVDnxpEnzKpRfRbV46NNNDhjqmdk77'/>
              </CardRow>
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
