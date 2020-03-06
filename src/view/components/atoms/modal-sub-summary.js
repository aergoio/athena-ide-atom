import React from 'react';
import PropTypes from 'prop-types';

const modalSubSummaryClass = 'component-modal-sub-summary';

export const ModalSubSummary = (props) => {
  return (
    <div className={['inline-block', modalSubSummaryClass, props.class].join(' ')}>
      {props.content}
    </div>
  );
};

ModalSubSummary.propTypes = {
  content: PropTypes.string,
  class: PropTypes.class
};

export default ModalSubSummary;
