import React from 'react';
import PropTypes from 'prop-types';

const cardItemClass = 'component-card-item';

export const CardItem = (props) => {
  const ratio = typeof props.ratio === "undefined" ? 0 : props.ratio;
  const hideOverflow = typeof props.hideOverflow === "undefined" ? false : props.hideOverflow;

  let inlineStyle = {
    flex: [ratio, ratio, "auto"].join(' '),
  };
  if (typeof props.style !== "undefined") {
    inlineStyle = Object.assign(inlineStyle, props.style);
  }

  if (hideOverflow) {
    inlineStyle.width = "1px";
  }

  return (
    <div style={inlineStyle} className={[cardItemClass, "inline-block", props.class].join(' ')}>
      {props.children}
    </div>
  );
};

CardItem.propTypes = {
  children: PropTypes.element.isRequired,
  ratio: PropTypes.number,
  hideOverflow: PropTypes.bool,
  class: PropTypes.class,
  style: PropTypes.class
};

export default CardItem;
