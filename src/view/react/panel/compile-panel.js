'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  Panel, ComponentsHolder, Row,
  Title, Description, SelectBox, TextBox
} from '../components';

export default class CompilePanel extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = { context: props.context };
    this._onCompiledFileChange = this._onCompiledFileChange.bind(this);
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.state.context.services.compileService.changeCompiledTarget(selectedOption.value);
  }

  render() {
    return (
      <Panel>
        <ComponentsHolder>
          <CompileResultTitle />
          <FileSelect context={this.props.context} onChange={this._onCompiledFileChange} />
          <Payload context={this.props.context} />
          <Abi context={this.props.context} />
        </ComponentsHolder>
      </Panel>
    );
  }

}

const CompileResultTitle = () => {
  return (
    <Row>
      <Title title='Compile Result'/>
    </Row>
  );
}

const FileSelect = (props) => {
  const option = props.context.current.file;
  const options = Array.from(props.context.store.file2CompiledResult.keys());
  return (
    <Row>
      <Description description="File" />
      <SelectBox
        value={option}
        options={options}
        onChange={props.onChange}
      />
    </Row>
  );
}

FileSelect.propTypes = {
  context: PropTypes.any,
  onChange: PropTypes.func
}

const Payload = (props) => {
  const file = props.context.current.file;
  const file2CompiledResult = props.context.store.file2CompiledResult;
  const payload = file2CompiledResult.has(file) ? file2CompiledResult.get(file).payload : "";
  return (
    <Row>
      <Description description="Payload" />
      <TextBox text={payload} />
    </Row>
  );
}

Payload.propTypes = {
  context: PropTypes.any
}

const Abi = (props) => {
  const file = props.context.current.file;
  const file2CompiledResult = props.context.store.file2CompiledResult;
  const abi = file2CompiledResult.has(file) ? file2CompiledResult.get(file).abi : "";
  return (
    <Row>
      <Description description="ABI" />
      <TextBox class='component-textbox-abi' text={abi} />
    </Row>
  );
}

Abi.propTypes = {
  context: PropTypes.any
}