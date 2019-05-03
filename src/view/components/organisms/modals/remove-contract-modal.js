import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {CardRow, Title, Button} from '../../atoms';

@inject('contractStore')
@observer
export default class RemoveContractModal extends React.Component {

  static get propTypes() {
    return {
      contractStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("Remove contract confirm button clicked");
    const contract = this.props.contractStore.currentContract;
    this.props.contractStore.removeContract(contract);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardRow>
                <Title title='Do you want to remove current contract?' />
              </CardRow>
              <CardRow class='card-row-button'>
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
