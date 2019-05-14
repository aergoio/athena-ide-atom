import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Button } from '../atoms';
import { CardTitle, FoldableCard, ContractConstructor, TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onChangeTarget = props.onChangeTarget;

  const constructorArgs = props.constructorArgs;
  const payable = props.payable;
  const argsRef = React.createRef();

  const onDeploy = props.onDeploy;

  let ConstructorOrNot;
  if (constructorArgs.length > 0) {
    ConstructorOrNot = () => (
      <ContractConstructor args={constructorArgs} payable={payable} argsRef={argsRef} />
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
      </CardRow>
    </FoldableCard>
  );
}

Deployment.propTypes = {
  currentTarget: PropTypes.string,
  targets: PropTypes.array,
  onChangeTarget: PropTypes.func,
  constructorArgs: PropTypes.array,
  payable: PropTypes.bool,
  onDeploy: PropTypes.func,
}

export default Deployment;
