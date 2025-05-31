import { combineReducers } from '@reduxjs/toolkit';
import user from '../slices/userSlice';
import message from '../slices/messageSlice';
import organizations from '../slices/organizationStore/organizationsSlice';
import stops from '../slices/stopStore/stopsSlice';
import stop from '../slices/stopStore/stopSlice';
import routes from '../slices/routeStore/routesSlice';
import route from '../slices/routeStore/routeSlice';
import transport from '../slices/transportStore/transportSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    user,
    message,
    organizations,
    stops,
    stop,
    routes,
    route,
    transport,
    ...asyncReducers,
  });

  if (action.type === 'user/userLoggedOut') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
