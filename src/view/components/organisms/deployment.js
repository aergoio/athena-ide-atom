'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onCompile = props.onCompile;
  const onDeploy = props.onDeploy;
  const onChangeTarget = props.onChangeTarget;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Deploy'/>
      </Row>
      <TargetSelect
        target={currentTarget}
        targets={targets}
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
  currentTarget: PropTypes.string,
  targets: PropTypes.array,
  onChangeTarget: PropTypes.func,
  onCompile: PropTypes.func,
  onDeploy: PropTypes.func
}

export default Deployment;