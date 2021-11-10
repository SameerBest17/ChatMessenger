import {authReducer} from './auth'
import {roomReducer} from './Room'
import { combineReducers } from 'redux';
import { allUsersReducer } from './allUsers';

const rootAllReducers = combineReducers({auth:authReducer});
export default rootAllReducers;