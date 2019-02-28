'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Title, Description, SelectBox, TextBox} from '../component';

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

  _parseCurrentFile() {
    return this.state.context.current.file;
  }

  _parseFiles() {
    return Array.from(this.state.context.store.file2CompiledResult.keys());
  }

  _parsePayload() {
    const file = this.state.context.current.file;
    const file2CompiledResult = this.state.context.store.file2CompiledResult;
    return file2CompiledResult.has(file) ? file2CompiledResult.get(file).payload : "";
  }

  _parseAbi() {
    const file = this.state.context.current.file;
    const file2CompiledResult = this.state.context.store.file2CompiledResult;
    return file2CompiledResult.has(file) ? file2CompiledResult.get(file).abi : "";
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.state.context.services.compileService.changeCompiledTarget(selectedOption.value);
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
              value={this._parseCurrentFile()}
              options={this._parseFiles()}
              onChange={(o) => this._onCompiledFileChange(o)}
            />
          </div>
          <div className='components-row'>
            <Description description="Payload" />
            <TextBox text={this._parsePayload()} />
          </div>
          <div className='components-row'>
            <Description description="ABI" />
            <TextBox class='component-textbox-abi' text={this._parseAbi()} />
          </div>
        </div>
      </div>
    );
  }

}