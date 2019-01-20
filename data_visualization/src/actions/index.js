import {CHANGE_PAGE} from './types';

export const changeHome = () => ({
  type: CHANGE_PAGE,
  payload: {
    page: 'Home'
  }
});

export const changeView = () => ({
  type: CHANGE_PAGE,
  payload: {
    page: 'View'
  }
});
