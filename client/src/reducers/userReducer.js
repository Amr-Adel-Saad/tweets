import { LOGIN_USER, LOGOUT_USER, GET_USER, UPDATE_USER_TWEETS, UPDATE_USER_IMAGE } from '../actions/types';

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
    case GET_USER:
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
    case UPDATE_USER_TWEETS:
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: [action.payload, ...state.userData.tweets]
        }
      };
    case UPDATE_USER_IMAGE:
      return {
        ...state,
        userData: {
          ...state.userData,
          image: action.payload
        }
      }
    default:
      return state;
  }
}