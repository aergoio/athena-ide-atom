import React from 'react'
import PropTypes from 'prop-types';

import { Card, CardRow, Button } from '../atoms';

export const TopBar = (props) => {
  const onCompile = props.onCompile;
  const onRefresh = props.onRefresh;
  return (
    <Card class='transparent-background'>
      <CardRow class='card-row-top-bar'>
        <Button
          name='Compile'
          class='component-btn-top-bar'
          onClick={onCompile}
        />
        <Button
          name='Refresh'
          class='component-btn-top-bar'
          onClick={onRefresh}
        />
      </CardRow>
    </Card>
  );
}

TopBar.propTypes = {
  onCompile: PropTypes.func,
  onRefresh: PropTypes.func,
}

export default TopBar;
