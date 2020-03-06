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

@inject('nodeStore')
@observer
export default class RemoveNodeModal extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("Remove node confirm button clicked");
    const node = this.props.nodeStore.currentNode;
    this.props.nodeStore.removeNode(node);
  }

  render() {
    const disabled = "" === this.props.nodeStore.currentNode;
    return (
      <Popup modal trigger={<Button name='Remove' disabled={disabled} />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Remove node' />
              <CardRow class='component-card-row-border' />
              <CardRow>
                <ModalSummary content='Do you want to remove current node?' />
              </CardRow>
              <CardRow>
                <ModalSubSummary content='Removed node cannot be recovered' />
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
