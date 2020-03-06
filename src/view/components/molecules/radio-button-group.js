import React from 'react'
import PropTypes from 'prop-types';
import { RadioButton } from '../atoms';

const radioButtonGroupClass = "component-radio-btn-group";

export default class RadioButtonGroup extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      selected: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      onSelect: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const checked = this.props.selected;
    const items = this.props.items;
    const name = this.props.name;
    const onSelect = this.props.onSelect;
    return (
      <div className={['inline-block', radioButtonGroupClass, this.props.class].join(' ')}>
        {
          items.map((item, i) => {
            if (item == checked) {
              return (
                <RadioButton checked key={i} name={name} text={item} onClick={() => { if (onSelect) onSelect(item)} }/>
              );
            } else {
              return (
                <RadioButton key={i} name={name} text={item} onClick={() => { if (onSelect) onSelect(item)}} />
              );
            }
          })
        }
      </div>
    );
  }

}