'use babel';

import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Description, InputBox, Button} from '../components';

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
    this.state = {
      node: ""
    };
    this._updateNode = this._updateNode.bind(this);
  }

  _updateNode(e) {
    this.setState({ node: e.target.value });
  }

  _onConfirm() {
    logger.debug("Add node button clicked");
    const node = this.state.node;
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
                <InputBox onChange={this._updateNode} type='text'
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
