import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  CardRow, Button, Description, InputBox,
  ModalSummary, ModalSubSummary,
} from '../../atoms';
import { CardTitle } from '../../molecules';

@inject('nodeStore')
@observer
export default class NewNodeModal extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
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
      <Popup modal trigger={<Button name='New' class='component-btn-rightmost' />}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <CardTitle title='New Node' />
              <CardRow class='component-card-row-border' />
              <CardRow>
                <ModalSummary content='Are you sure you want to add node?' />
              </CardRow>
              <CardRow>
                <ModalSubSummary content='To import, enter node information' />
              </CardRow>
              <CardRow>
                <Description description='Node' />
              <InputBox ref={this.nodetInputRef} type='text'
                    placeHolder='eg. 192.168.1.168:7845'/>
              </CardRow>
              <CardRow class='component-card-row-button-modal'>
                <Button name='Cancel' onClick={close}/>
                <Button name='Ok' class='component-btn-rightmost'
                    onClick={() => { this._onConfirm(); close(); }} />
              </CardRow>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
