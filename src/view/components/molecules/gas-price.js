import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description, TextBox, SelectBox } from '../atoms';
import { convertToUnit } from '../../../utils';

const units = [ "aer", "gaer", "aergo" ];

export default class GasPrice extends React.Component {

  static get propTypes() {
    return {
      price: PropTypes.string
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      price: props.price,
      displayPrice: props.price,
      unit: 'aer'
    };
    this._onUnitChange = this._onUnitChange.bind(this);
  }

  _onUnitChange(newUnit) {
    this.setState({
      displayPrice: convertToUnit(this.state.price, 'aer', newUnit),
      unit: newUnit
    });
  }

  render() {
    const onChange = this._onUnitChange;
    return (
      <CardRow>
        <CardItem ratio={0}>
          <Description description='Gas Price' />
        </CardItem>
        <CardItem ratio={1}>
          <TextBox text={this.state.displayPrice} />
        </CardItem>
        <CardItem ratio={0}>
          <SelectBox
            class='component-selectbox-unit'
            value={this.state.unit}
            options={units}
            onChange={onChange}
          />
        </CardItem>
      </CardRow>
    );
  }

}