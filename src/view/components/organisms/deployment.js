'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { DeploySelectAndRun } from '../molecules';

export const Deployment = (props) => {
  const currentFile = props.currentFile;
  const files = props.files;
  const onDeploy = props.onDeploy;
  const onChangeTarget = props.onChangeTarget;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Deploy'/>
      </Row>
      <DeploySelectAndRun
        file={currentFile}
        files={files}
        onClick={onDeploy}
        onChange={onChangeTarget}
      />
    </ComponentsHolder>
  );
}

Deployment.propTypes = {
  currentFile: PropTypes.string,
  files: PropTypes.array,
  onDeploy: PropTypes.func,
  onChangeTarget: PropTypes.func
}

export default Deployment;