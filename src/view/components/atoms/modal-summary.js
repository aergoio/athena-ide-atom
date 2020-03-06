import React from 'react';
import PropTypes from 'prop-types';

const modalSummaryClass = 'component-modal-summary';

export const ModalSummary = (props) => {
  return (
    <div className={['inline-block', modalSummaryClass, props.class].join(' ')}>
      {props.content}
    </div>
  );
};

ModalSummary.propTypes = {
  content: PropTypes.string,
  class: PropTypes.class
};

export default ModalSummary;
