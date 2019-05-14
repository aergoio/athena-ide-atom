import React from 'react'
import PropTypes from 'prop-types';

import { Card, CardRow, Button, SyncIcon } from '../atoms';

export const Sync = (props) => {
  const onCompile = props.onCompile;
  const onSync = props.onSync;
  return (
    <Card class='transparent-background'>
      <CardRow class='card-row-sync'>
        <Button
          name='Compile'
          class='component-btn-rightmost'
          onClick={onCompile}
        />
        <SyncIcon onClick={onSync} />
      </CardRow>
    </Card>
  );
}

Sync.propTypes = {
  onCompile: PropTypes.func,
  onSync: PropTypes.func,
}

export default Sync;
