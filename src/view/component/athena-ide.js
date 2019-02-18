'use babel';

import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

export default class AthenaIde extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tabIndex: 0};
  }

  render() {
    return (
      <Tabs onSelect={index => this.setState({ tabIndex: index })}>
        <TabList className="react-tabs__tab-list">
          <Tab>Compile</Tab>
          <Tab>Run</Tab>
        </TabList>
        <TabPanel>
          <div>Compile view is not yet implemented</div>
        </TabPanel>
        <TabPanel>
          <div>Run view is not yet implemented</div>
        </TabPanel>
      </Tabs>
    );
  }

}