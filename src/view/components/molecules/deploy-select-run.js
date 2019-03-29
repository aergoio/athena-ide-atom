'use babel';

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Button, SelectBox  } from '../atoms';

export const DeploySelectAndRun = (props) => {
  return (
    <Row>
      <Button
        name='Deploy'
        class={['component-btn-runner', 'component-description', 'component-btn-deploy']}
        onClick={props.onClick}
      />
      <SelectBox
        value={props.file}
        options={props.files}
        onChange={props.onChange}
      />
    </Row>
  );
}

DeploySelectAndRun.propTypes = {
  file: PropTypes.string,
  files: PropTypes.array,
  onClick: PropTypes.func,
  onChange: PropTypes.func
}

export default DeploySelectAndRun;