// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authReducer from 'store/auth/authSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth:authReducer });

export default reducers;
