import React from 'react';

import { RunPanel } from './templates';

export default class AthenaIdeViewRoot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tabIndex: 0};
  }

  render() {
    return (
      <RunPanel />
    );
  }

}
