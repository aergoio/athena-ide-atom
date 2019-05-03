import React from 'react'
import PropTypes from 'prop-types';

import { Card, CardRow, SyncIcon } from '../atoms';

export const Sync = (props) => {
  const onSync = props.onSync;
  return (
    <Card class='transparent-background'>
      <CardRow class='card-row-sync'>
        <SyncIcon onClick={onSync} />
      </CardRow>
    </Card>
  );
}

Sync.propTypes = {
  onSync: PropTypes.func,
}

export default Sync;
