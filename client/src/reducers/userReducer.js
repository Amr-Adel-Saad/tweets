import { LOGIN_USER, LOGOUT_USER, GET_USER_DATA } from '../actions/types';

const initialState = {
  isLogged: false,
  userData: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isLogged: true
      };
    case GET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case LOGOUT_USER:
      return {
        ...state,
        isLogged: false,
        userData: ''
      };
    default:
      return state;
  }
}