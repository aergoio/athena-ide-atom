'use babel';

import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import {DeployPanel, RunPanel} from './templates';

export default class AthenaIdeViewRoot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tabIndex: 0};
  }

  render() {
    return (
      <Tabs onSelect={index => this.setState({ tabIndex: index })}>
        <TabList className="react-tabs__tab-list panel-heading">
          <Tab>Deploy</Tab>
          <Tab>Run</Tab>
        </TabList>
        <TabPanel>
          <DeployPanel />
        </TabPanel>
        <TabPanel>
          <RunPanel />
        </TabPanel>
      </Tabs>
    );
  }

}