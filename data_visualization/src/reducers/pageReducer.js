import {CHANGE_PAGE, CHANGE_TAB} from '../actions/types';

export default function pageChange(state ={page: 'Home', currentTab: 'Ethernet'}, action){
  switch(action.type){
    case CHANGE_PAGE:
      return {
        page: action.payload,
        currentTab: state.currentTab
      }
    case CHANGE_TAB:
      return {
        page: state.page,
        currentTab: action.payload
      }
    default:
      return state;
  }
}
