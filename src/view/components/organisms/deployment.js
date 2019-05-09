import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Button } from '../atoms';
import { CardTitle, FoldableCard, ContractConstructor, TargetSelect } from '../molecules';

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
    <FoldableCard trigger={<CardTitle title='Deploy' />}>
      <TargetSelect
        target={currentTarget}
        targets={targets}
        onChange={onChangeTarget}
      />
      <ConstructorOrNot />
      <CardRow class='card-row-button'>
        <Button
          name='Deploy'
          class='component-btn-transaction'
          onClick={() => onDeploy(argsRef)}
        />
        <Button
          name='Compile'
          class='component-btn-rightmost'
          onClick={onCompile}
        />
      </CardRow>
    </FoldableCard>
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
