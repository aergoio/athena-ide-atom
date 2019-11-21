/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

@inject('consoleStore')
@observer
export default class ConsoleViewRoot extends React.Component {

  static get propTypes() {
    return {
      consoleStore: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this._onClearClick = this._onClearClick.bind(this);
  }

  _onClearClick() {
    this.props.consoleStore.clear();
  }

  render() {
    const onClearClick = this._onClearClick;
    // require toJS in handling mobx proxy array
    const logs = toJS(this.props.consoleStore.logs);

    return (
      <div class='console-view-root'>
        <TopBar>
          <TopBarItem className='icon-x' onClick={onClearClick} />
        </TopBar>
        <BottomBar logs={logs} />
      </div>
    );
  }

}


// TODO : refactor following components into atom, molecules

const TopBar = (props) => {
  return (
    <div className={'top-bar'}>
      {props.children}
    </div>
  )
}

const TopBarItem = (props) => {
  return (
    <div
      className={['top-bar-item', props.className].join(' ')}
      onClick={props.onClick}>
    </div>
  );
};
TopBarItem.propTypes = {
  className: PropTypes.class,
  onClick: PropTypes.func.isRequired
};

class BottomBar extends React.Component {

  static get propTypes() {
    return {
      logs: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);
    this.lastLogRef = React.createRef();
  }

  componentDidUpdate() {
    // move to last log element
    const current = this.lastLogRef.current;
    if (current) {
      current.scrollIntoView(false);
    }
  }

  render() {
    const logs = this.props.logs;
    const logsView = logs.map((log, index) => {
      if (index === (logs.length - 1)) {
        return <Log time={log.time} message={log.message} level={log.level} innerRef={this.lastLogRef} />;
      } else {
        return <Log time={log.time} message={log.message} level={log.level} />;
      }
    });
    return (
      <div className={'bottom-bar'}>
        {logsView}
      </div>
    )
  }

}

const Log = (props) => {
  const time = props.time;
  const message = props.message;
  const level = props.level;
  const innerRef = props.innerRef;
  return (
    <div className={'log'} ref={innerRef}>
      <Time time={time} />
      <Message message={message} level={level} />
    </div>
  )
}
Log.propTypes = {
  time: PropTypes.string,
  message: PropTypes.string,
  level: PropTypes.string,
}

const Time = (props) => {
  const time = props.time;
  return (
    <div className={'time'}>
      {time}
    </div>
  )
}
Time.propTypes = {
  time: PropTypes.string
};

const Message = (props) => {
  const message = props.message;
  const level = typeof props.level === "undefined" ? "info" : props.level;
  return (
    <div className={['message', ('level-' + level)].join(' ')}>
      {message}
    </div>
  )
}
Message.propTypes = {
  message: PropTypes.string,
  level: PropTypes.string
};