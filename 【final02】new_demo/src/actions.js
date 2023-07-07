import {createAction} from 'redux-actions';

export const setMapConfig = createAction('SET_MAP_CONFIG', payload => payload);

export const UPDATE_MOUSELNG = 'UPDATE_MOUSELNG';
export const UPDATE_MOUSELAT = 'UPDATE_MOUSELAT';
export const QUERY_FLIGHTS = 'QUERY_FLIGHTS';

export const updateMouselng = value => ({
  type: UPDATE_MOUSELNG,
  payload: value
});

export const updateMouselat = value => ({
  type: UPDATE_MOUSELAT,
  payload: value
});

export const updateQueryflights = value => ({
  type: QUERY_FLIGHTS,
  payload: value
});
