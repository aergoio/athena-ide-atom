import React from 'react'
import PropTypes from 'prop-types';
import { ButtonGroupItem } from '../atoms';

const buttonGroupClass = "component-btn-group";

// TODO: choose ButtonGroup or RadioGroup
export default class SelectGroup extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      selected: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
      onSelect: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const selected = this.props.selected;
    const items = this.props.items;
    const onSelect = this.props.onSelect;
    return (
      <div className={['btn-group', buttonGroupClass, this.props.class].join(' ')}>
        {
          items.map((item, i) => {
            if (item === selected) {
              return (
                <ButtonGroupItem key={i} name={item} selected onClick={() => { if (onSelect) onSelect(item)} }/>
              );
            } else {
              return (
                <ButtonGroupItem key={i} name={item} onClick={() => { if (onSelect) onSelect(item)}} />
              );
            }
          })
        }
      </div>
    );
  }

}