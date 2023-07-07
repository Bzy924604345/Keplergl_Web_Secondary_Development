import {createAction, handleActions} from 'redux-actions';
import KeplerGlSchema from '@kepler.gl/schemas';
import {
  UPDATE_MOUSELNG,
  UPDATE_MOUSELAT,
  QUERY_FLIGHTS
} from './actions';

// CONSTANTS
export const INIT = 'INIT';
export const SET_MAP_CONFIG = 'SET_MAP_CONFIG';

// ACTIONS
export const appInit = createAction(INIT);
export const setMapConfig = createAction(SET_MAP_CONFIG);

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false,
  mouselng:0,
  mouselat:0,
  Query_flights:false
};

// REDUCER
const appReducer = handleActions(
  {
    [INIT]: (state, action) => ({
      ...state,
      loaded: true
    }),
    [SET_MAP_CONFIG]: (state, action) => ({
      ...state,
      mapConfig: KeplerGlSchema.getConfigToSave(action.payload)
    }),
    [UPDATE_MOUSELNG]: (state, action) => ({
      ...state,
      mouselng: action.payload
    }),
    [UPDATE_MOUSELAT]: (state, action) => ({
      ...state,
      mouselat: action.payload
    }),
    [QUERY_FLIGHTS]: (state, action) => ({
      ...state,
      Query_flights: action.payload
    })
  },
  initialState
);

export default appReducer;
