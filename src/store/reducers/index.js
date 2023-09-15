// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authReducer from 'store/auth/authSlice';
import credentialsReducer from "store/credentials/credentialsSlice"
import templatesReducer from "../templates/templateSlice"

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth:authReducer, credentials:credentialsReducer, templates:templatesReducer });

export default reducers;
