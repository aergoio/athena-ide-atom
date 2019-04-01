'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Description, InputBox, Button} from '../../atoms';

@inject('nodeStore')
@observer
export default class NewNodeModal extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.nodetInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Add node button clicked");
    const node = this.nodetInputRef.current.value;
    this.props.nodeStore.addNode(node);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <Row>
                <Title title='Enter node endpoint' />
              </Row>
              <Row>
                <Description description='Node' />
              <InputBox ref={this.nodetInputRef} type='text'
                    placeHolder='eg. 192.168.1.168:7845'/>
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
