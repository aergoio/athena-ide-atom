'use babel';

import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  Panel, ComponentsHolder, Row,
  Title, Description, SelectBox, TextBox
} from '../components';

@inject('compileResultStore')
@observer
export default class CompilePanel extends React.Component {

  constructor(props) {
    super(props);
    this._onCompiledFileChange = this._onCompiledFileChange.bind(this);
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.props.compileResultStore.changeFile(selectedOption.value);
  }

  render() {
    const currentFile = this.props.compileResultStore.currentFile;
    const files = this.props.compileResultStore.files;
    const payload = this.props.compileResultStore.compileResult.payload;
    const abi = this.props.compileResultStore.compileResult.abi;

    return (
      <Panel>
        <ComponentsHolder>
          <CompileResultTitle />
          <FileSelect file={currentFile} files={files} onChange={this._onCompiledFileChange} />
          <Payload payload={payload} />
          <Abi abi={abi} />
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
  return (
    <Row>
      <Description description="File" />
      <SelectBox
        value={props.file}
        options={props.files}
        onChange={props.onChange}
      />
    </Row>
  );
}

FileSelect.propTypes = {
  file: PropTypes.string,
  files: PropTypes.array,
  onChange: PropTypes.func
}

const Payload = (props) => {
  return (
    <Row>
      <Description description="Payload" />
      <TextBox text={props.payload} />
    </Row>
  );
}

Payload.propTypes = {
  payload: PropTypes.string
}

const Abi = (props) => {
  return (
    <Row>
      <Description description="ABI" />
      <TextBox class='component-textbox-abi' text={props.abi} />
    </Row>
  );
}

Abi.propTypes = {
  abi: PropTypes.string
}