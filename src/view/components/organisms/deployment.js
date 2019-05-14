import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Button } from '../atoms';
import { CardTitle, FoldableCard, ConstructorArguments, TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onChangeTarget = props.onChangeTarget;

  const constructorArgs = props.constructorArgs;
  const payable = props.payable;
  const argsRef = React.createRef();

  const onDeploy = props.onDeploy;

  let constructorOrNot;
  if (constructorArgs.length > 0) {
    constructorOrNot = <ConstructorArguments args={constructorArgs} payable={payable} argsRef={argsRef} />;
  } else {
    constructorOrNot = <div></div>;
  }

  return (
    <FoldableCard trigger={<CardTitle title='Deploy' />}>
      <TargetSelect
        target={currentTarget}
        targets={targets}
        onChange={onChangeTarget}
      />
      {constructorOrNot}
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
