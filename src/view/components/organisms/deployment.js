'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { ContractConstructor, TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onCompile = props.onCompile;
  const onDeploy = props.onDeploy;
  const onChangeTarget = props.onChangeTarget;
  const constructorArgs = props.constructorArgs;
  const argsRef = React.createRef();

  let ConstructorOrNot;
  if (constructorArgs.length > 0) {
    ConstructorOrNot = () => (
      <ContractConstructor args={constructorArgs} argsRef={argsRef} />
    );
  } else {
    ConstructorOrNot = () => <div></div>;
  }

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
      <ConstructorOrNot />
      <Row class='components-row-button'>
        <Button
          name='Compile'
          class='btn-success'
          onClick={onCompile}
        />
        <Button
          name='Deploy'
          class='btn-warning'
          onClick={() => onDeploy(argsRef)}
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
  onDeploy: PropTypes.func,
  constructorArgs: PropTypes.array
}

export default Deployment;