// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authReducer from 'store/auth/authSlice';
import credentialsReducer from "store/credentials/credentialsSlice"
import templatesReducer from "../templates/templateSlice"
import reportsReducer from "../reports/reportsSlice"

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth:authReducer, credentials:credentialsReducer, templates:templatesReducer, reports:reportsReducer });

export default reducers;
