import {combineReducers} from 'redux';
import pageChange from './pageReducer';

export default combineReducers({
  pageChange: pageChange
});
