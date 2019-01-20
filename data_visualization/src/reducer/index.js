const initialState = {
  page: 'Home'
};

function rootReducer(state = [] , action) {

  return Object.assign({}, state, {
      page: action.page
    });
};
export default rootReducer;
