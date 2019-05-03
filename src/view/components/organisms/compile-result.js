import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Title } from '../atoms';
import { FoldableCard, Payload, Abi } from '../molecules';

export const CompileResult = (props) => {
  const payload = props.payload;
  const abi = props.abi;

  const trigger = (
    <CardRow>
      <Title title='Compile Result'/>
    </CardRow>
  );
  return (
    <FoldableCard trigger={trigger}>
      <Payload payload={payload} />
      <Abi abi={abi} />
    </FoldableCard>
  );
}

CompileResult.propTypes = {
  payload: PropTypes.string,
  abi: PropTypes.string
}

export default CompileResult;
