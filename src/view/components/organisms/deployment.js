'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentFile = props.currentFile;
  const files = props.files;
  const onCompile = props.onCompile;
  const onDeploy = props.onDeploy;
  const onChangeTarget = props.onChangeTarget;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Deploy'/>
      </Row>
      <TargetSelect
        file={currentFile}
        files={files}
        onChange={onChangeTarget}
      />
      <Row class='components-row-button'>
        <Button
          name='Compile'
          onClick={onCompile}
        />
        <Button
          name='Deploy'
          onClick={onDeploy}
        />
      </Row>
    </ComponentsHolder>
  );
}

Deployment.propTypes = {
  currentFile: PropTypes.string,
  files: PropTypes.array,
  onChangeTarget: PropTypes.func,
  onCompile: PropTypes.func,
  onDeploy: PropTypes.func
}

export default Deployment;