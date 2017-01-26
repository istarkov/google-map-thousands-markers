import React from 'react';
import { Observable } from 'rxjs';
import componentFromStream from 'recompose/componentFromStream';
import { Match } from 'react-router';

const AsyncComponent = componentFromStream((props$) => {
  const sream$ = props$
    .map(({ component }) => component)
    .distinctUntilChanged()
    .switchMap(component => Observable.fromPromise(component()))
    .startWith(undefined);

  return props$.combineLatest(
    sream$,
    ({ component, renderLoading, ...props }, Component) => (
      Component === undefined
        ? renderLoading ? renderLoading() : null
        : <Component {...props} />
    )
  );
});

export default ({
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
      props => (
        <AsyncComponent {...props} {...rest} />
      )
    }
  />
);
