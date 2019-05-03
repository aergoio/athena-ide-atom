import React from 'react'
import PropTypes from 'prop-types';
import { StarTitle, StarContent } from '../atoms';

const starClass = 'star';

export const Star = (props) => {
  return (
    <div className={starClass}>
      <StarTitle title={props.title} />
      <StarContent content={props.content} />
    </div>
  );
}

Star.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string
}

export default Star;
