import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers/rootReducer";
function configureStore(state = []) {
  return createStore(rootReducer,applyMiddleware(thunk));
}
export default configureStore;
