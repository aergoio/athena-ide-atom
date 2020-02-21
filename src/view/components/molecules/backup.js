import React from 'react'
import PropTypes from 'prop-types';
import { ButtonGroupItem } from '../atoms';
import logger from 'loglevel';

const buttonGroupClass = "component-btn-group";

// TODO: choose ButtonGroup or RadioGroup
export default class SelectGroup extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      items: PropTypes.array.isRequired,
      onChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: 0 < props.items.length ? props.items[0] : undefined
    };
    this._onSelect = this._onSelect.bind(this);
  }

  get selected() {
    return this.state.selected;
  }

  _onSelect(item) {
    logger.debug("select item", item);
    this.setState({
      selected: item
    });
  }

  render() {
    const items = this.props.items;
    const onSelect = this._onSelect;
    const onChange = this.props.onChange;
    return (
      <div className={['btn-group', buttonGroupClass, this.props.class].join(' ')}>
        {
          items.map((item, i) => {
            if (item === this.state.selected) {
              return (
                <ButtonGroupItem key={i} name={item} selected onClick={() => { onSelect(item); onChange(); }} />
              );
            } else {
              return (
                <ButtonGroupItem key={i} name={item} onClick={() => { onSelect(item); onChange(); }} />
              );
            }
          })
        }
      </div>
    );
  }

}