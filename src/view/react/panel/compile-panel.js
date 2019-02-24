'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {Title, Description, SelectBox, TextBox} from '../component';

import logger from '../../../logger';

export default class CompilePanel extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = { context: props.context };
  }

  _parseCurrentFile(context) {
    return context.current.file;
  }

  _parseFiles(context) {
    return Array.from(context.store.file2CompiledResult.keys());
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("compiled file change");
    logger.debug(selectedOption);
    this.state.context.services.compileService.changeCompiledTarget(selectedOption.value);
  }

  _parsePayload(context) {
    const file = context.current.file;
    const file2CompiledResult = context.store.file2CompiledResult;
    return file2CompiledResult.has(file) ? file2CompiledResult.get(file).payload : "";
  }

  _parseAbi(context) {
    const file = context.current.file;
    const file2CompiledResult = context.store.file2CompiledResult;
    return file2CompiledResult.has(file) ? file2CompiledResult.get(file).abi : "";
  }

  render() {
    return (
      <div className='athena-ide-tab-panel'>
        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Compile Result'/>
          </div>
          <div className='components-row'>
            <Description description="File" />
            <SelectBox
              value={this._parseCurrentFile(this.props.context)}
              options={this._parseFiles(this.props.context)}
              onChange={(o) => this._onCompiledFileChange(o)}
            />
          </div>
          <div className='components-row'>
            <Description description="Payload" />
            <TextBox text={this._parsePayload(this.props.context)} />
          </div>
          <div className='components-row'>
            <Description description="ABI" />
            <TextBox class='component-textbox-abi' text={this._parseAbi(this.props.context)} />
          </div>
        </div>
      </div>
    );
  }

}