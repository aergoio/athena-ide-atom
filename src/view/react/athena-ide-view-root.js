'use babel';

import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import PropTypes from 'prop-types';

import {CompilePanel, RunPanel} from './panel';

export default class AthenaIdeViewRoot extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = {tabIndex: 0};
  }

  render() {
    return (
      <Tabs onSelect={index => this.setState({ tabIndex: index })}>
        <TabList className="react-tabs__tab-list panel-heading">
          <Tab>Compile</Tab>
          <Tab>Run</Tab>
        </TabList>
        <TabPanel>
          <CompilePanel context={this.props.context}/>
        </TabPanel>
        <TabPanel>
          <RunPanel context={this.props.context}/>
        </TabPanel>
      </Tabs>
    );
  }

}