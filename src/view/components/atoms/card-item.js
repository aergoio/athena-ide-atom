import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const cardItemClass = 'component-card-item';

export const CardItem = (props) => {
  const ratio = typeof props.ratio === "undefined" ? 0 : props.ratio;
  const hideOverflow = typeof props.hideOverflow === "undefined" ? false : props.hideOverflow;

  const inlineStyle = {
    flex: join(ratio, ratio, "auto"),
  };
  if (hideOverflow) {
    inlineStyle.width = "1px";
  }
  return (
    <div style={inlineStyle} className={join(cardItemClass, "inline-block", props.class)}>
      {props.children}
    </div>
  );
};

CardItem.propTypes = {
  children: PropTypes.element.isRequired,
  ratio: PropTypes.number,
  hideOverflow: PropTypes.bool,
  class: PropTypes.class
};

export default CardItem;
