'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { FileSelect, Payload, Abi } from '../molecules';

export const CompileResult = (props) => {
  const currentFile = props.currentFile;
  const files = props.files;
  const payload = props.payload;
  const abi = props.abi;
  const onFileChange = props.onFileChange;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Compile Result'/>
      </Row>
      <FileSelect file={currentFile} files={files} onChange={onFileChange} />
      <Payload payload={payload} />
      <Abi abi={abi} />
    </ComponentsHolder>
  );
}

CompileResult.propTypes = {
  currentFile: PropTypes.string,
  files: PropTypes.array,
  payload: PropTypes.string,
  abi: PropTypes.string,
  onFileChange: PropTypes.func
}

export default CompileResult;