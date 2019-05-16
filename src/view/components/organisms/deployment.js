import React from 'react'
import { Flex } from 'reflexbox';
import PropTypes from 'prop-types';

import { Description, CardRow, Button } from '../atoms';
import { CardTitle, FoldableCard, ConstructorArguments, TargetSelect } from '../molecules';

export const Deployment = (props) => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onTargetChange = props.onTargetChange;

  const constructorArgs = props.constructorArgs;
  const payable = props.payable;
  const argsRef = React.createRef();
  const onDeploy = props.onDeploy;

  let constructorOrNot = <ConstructorArguments args={constructorArgs} payable={payable} argsRef={argsRef} />;

  return (
    <FoldableCard trigger={<CardTitle title='Deploy' />}>
      <TargetSelect
        target={currentTarget}
        targets={targets}
        onChange={onTargetChange}
      />
      {constructorOrNot}
      <CardRow>
        <Description description='' />
        <Flex justify='flex-end' w={1}>
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
  onTargetChange: PropTypes.func,
  constructorArgs: PropTypes.array,
  payable: PropTypes.bool,
  onDeploy: PropTypes.func,
}

export default Deployment;
