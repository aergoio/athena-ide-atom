import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, SyncIcon } from '../atoms';

export const Sync = (props) => {
  const onSync = props.onSync;
  return (
    <ComponentsHolder class='components-holder-sync'>
      <Row class='components-row-sync'>
        <SyncIcon onClick={onSync} />
      </Row>
    </ComponentsHolder>
  );
}

Sync.propTypes = {
  onSync: PropTypes.func,
}

export default Sync;