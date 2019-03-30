'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const panelClass = 'athena-ide-tab-panel';

export const Panel = (props) => {
  return (
    <div className={panelClass}>
      {props.children}
    </div>
  );
};

Panel.propTypes = {
  children: PropTypes.element.isRequired
};

export default Panel;