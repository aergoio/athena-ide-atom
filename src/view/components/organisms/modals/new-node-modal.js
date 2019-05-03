import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {CardRow, Title, Description, InputBox, Button} from '../../atoms';

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
              <CardRow>
                <Title title='Enter node endpoint' />
              </CardRow>
              <CardRow>
                <Description description='Node' />
              <InputBox ref={this.nodetInputRef} type='text'
                    placeHolder='eg. 192.168.1.168:7845'/>
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
