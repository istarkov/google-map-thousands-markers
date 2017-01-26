import React from 'react';
import { Match } from 'react-router';

export const matchWithProps = ({
  component: Component,
  exactly,
  pattern,
  location,
  ...rest
}) => (
  <Match
    exactly={exactly}
    pattern={pattern}
    location={location}
    render={
      props => <Component {...props} {...rest} />
    }
  />
);

export default matchWithProps;
