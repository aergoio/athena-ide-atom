'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Button} from '../../atoms';

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
    this.props.nodeStore.removeNode();
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <Row>
                <Title title='Do you want to remove current node?' />
              </Row>
              <Row class='components-row-button'>
                <Button name='Ok' onClick={() => { this._onConfirm(); close(); }} />
                <Button name='Cancel' onClick={close}/>
              </Row>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}