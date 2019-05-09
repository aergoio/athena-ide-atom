import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { CardRow, Button } from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('nodeStore')
@observer
export default class RemoveNodeModal extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
      trigger: PropTypes.element
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
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='Do you want to remove current node?' />
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
