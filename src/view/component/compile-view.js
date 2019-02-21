'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import Title from './title';
import Description from './description';
import SelectBox from './select-box';
import TextBox from './text-box';
import logger from '../../logger';

export default class CompileView extends React.Component {

  static get propTypes() { 
    return { 
      context: PropTypes.any
    }; 
  }

  constructor(props) {
    super(props);
  }

  _parseCurrentFile(context) {
    return context.current.file;
  }

  _parseFiles(context) {
    return Array.from(context.store.file2CompiledResult.keys());
  }

  _onCompiledFileChange(selectedOption) {
    this.props.context.services.compileService.changeCompiledTarget(selectedOption.value);
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
      <div className='view'>
        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Compile Result'/>
          </div>
          <div className='components-row'>
            <Description description="File" />
            <SelectBox
              context={this.props.context}
              value={this._parseCurrentFile(this.props.context)}
              options={this._parseFiles(this.props.context)}
              onChange={this._onCompiledFileChange}
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