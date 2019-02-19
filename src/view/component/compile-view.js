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

  _onCompiledFileChange(selectedOption) {
    this.props.context.services.updateService.updateCompiledTarget(selectedOption.value);
  }

  _parseFile(context) {
    return context.current.file;
  }

  _parseCompiledFiles(context) {
    return Array.from(context.store.file2CompiledResult.keys());
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
          <div className='component'>
            <Title title='Compile Result'/>
          </div>
          <div className='component'>
            <Description description="File" />
            <SelectBox
              onChange={this._onCompiledFileChange}
              value={this._parseFile(this.props.context)}
              options={this._parseCompiledFiles(this.props.context)}
              context={this.props.context}
            />
          </div>
          <div className='component'>
            <Description description="Payload" />
            <TextBox text={this._parsePayload(this.props.context)} />
          </div>
          <div className='component'>
            <Description description="ABI" />
            <TextBox class='component-textbox-abi' text={this._parseAbi(this.props.context)} />
          </div>
        </div>
      </div>
    );
  }

}