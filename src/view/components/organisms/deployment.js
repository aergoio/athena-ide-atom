import React from 'react'
import { Flex } from 'reflexbox';
import PropTypes from 'prop-types';

import { Description, CardRow, Button } from '../atoms';
import { CardTitle, FoldableCard, ConstructorArguments, TargetSelect, ContractSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onDeployTargetChange = props.onDeployTargetChange;

  const constructorArgs = props.constructorArgs;
  const payable = props.payable;
  const argsRef = React.createRef();

  const currentContract = props.currentContract;
  const contracts = props.contracts;
  const onRedeployTargetChange = props.onRedeployTargetChange;

  const onDeploy = props.onDeploy;
  const onCompile = props.onCompile;

  return (
    <FoldableCard trigger={<CardTitle title='Deploy' />}>
      <TargetSelect
        target={currentTarget}
        targets={targets}
        onChange={onDeployTargetChange}
      />
      <ConstructorArguments args={constructorArgs} payable={payable} argsRef={argsRef} />
      <CardRow class='component-card-row-border' />
      <ContractSelect
        contract={currentContract}
        contracts={contracts}
        onChange={onRedeployTargetChange}
      />
      <CardRow>
        <Description description='' />
        <Flex justify='flex-end' w={1}>
          <Button
            name='Compile'
            class='component-btn-green'
            onClick={onCompile}
          />
          <Button
            name='Deploy'
            class='component-btn-transaction'
            onClick={() => onDeploy(argsRef)}
          />
        </Flex>
      </CardRow>
    </FoldableCard>
  );
}

Deployment.propTypes = {
  currentTarget: PropTypes.string,
  targets: PropTypes.array,
  onDeployTargetChange: PropTypes.func,
  constructorArgs: PropTypes.array,
  payable: PropTypes.bool,
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onRedeployTargetChange: PropTypes.func,
  onDeploy: PropTypes.func,
  onCompile: PropTypes.func,
}

export default Deployment;
