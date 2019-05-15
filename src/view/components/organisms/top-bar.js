import React from 'react'
import PropTypes from 'prop-types';

import { Card, CardRow, Button } from '../atoms';

export const TopBar = (props) => {
  const onCompile = props.onCompile;
  const onSync = props.onSync;
  return (
    <Card class='transparent-background'>
      <CardRow class='card-row-top-bar'>
        <Button
          name='Compile'
          class='component-btn-top-bar'
          onClick={onCompile}
        />
        <Button
          name='Sync'
          class='component-btn-top-bar'
          onClick={onSync}
        />
      </CardRow>
    </Card>
  );
}

TopBar.propTypes = {
  onCompile: PropTypes.func,
  onSync: PropTypes.func,
}

export default TopBar;
