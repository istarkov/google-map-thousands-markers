import { Observable } from 'rxjs';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';
import mapPropsStream from 'recompose/mapPropsStream';
import TooltipMarker from './TooltipMarker';

// to show animation we delay hover
export const hoveredTooltipMarkerHOC = compose(
  mapPropsStream((props$) => {
    const hover$ = props$
      .distinctUntilChanged(({ hover: prevHover }, { hover }) => hover === prevHover)
      .switchMap(({ hover }) => (
        hover
          ? Observable.of({ hover }).delay(16)
          : Observable.concat(
            Observable.of({ hover }),
            Observable.of({ hover, visible: false })
              .delay(100)
          )
      ))
      .startWith({
        hover: false,
      });
    // Observable.of(true).delay(16).startWith(false);

    return props$.combineLatest(hover$, (props, hover) => ({
      ...props,
      ...hover,
    }));
  }),
  branch(
    ({ visible }) => visible === false,
    renderNothing,
  ),
);

export default hoveredTooltipMarkerHOC(TooltipMarker);
