import React from 'react'
import PropTypes from 'prop-types';

import { Stars, StarsRow, StarCell, Void } from '../atoms';
import { Star } from '../molecules';

export const Summary = (props) => {
  const node = props.node;
  const address = props.address;
  const height = props.height;
  const balanceWithUnit = props.balanceWithUnit;
  const nonce = props.nonce;
  return (
    <Void>
      <Stars>
        <StarsRow>
          <StarCell>
            <Star title="Node" content={node} />
          </StarCell>
          <StarCell colspan="2">
            <Star title="Account" content={address} />
          </StarCell>
        </StarsRow>
        <StarsRow>
          <StarCell>
            <Star title="Height" content={height} />
          </StarCell>
          <StarCell>
            <Star title="Balance" content={balanceWithUnit} />
          </StarCell>
          <StarCell>
            <Star title="Nonce" content={nonce} />
          </StarCell>
        </StarsRow>
      </Stars>
    </Void>
  );
}

Summary.propTypes = {
  node: PropTypes.string,
  address: PropTypes.string,
  height: PropTypes.number,
  balanceWithUnit: PropTypes.number,
  nonce: PropTypes.number
}

export default Summary;
