import { LOGIN_USER, LOGOUT_USER, GET_USER, 
  UPDATE_USER_TWEETS, UPDATE_USER_IMAGE, FOLLOW_USER, UNFOLLOW_USER } from '../actions/types';

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
    case FOLLOW_USER:
      return {
        ...state,
        userData: {
          ...state.userData,
          following: [...state.userData.following, action.payload]
        }
      }
    case UNFOLLOW_USER:
      let following = state.userData.following;
      let i = following.indexOf(action.payload);
      following.splice(i, 1);

      return {
        ...state,
        userData: {
          ...state.userData,
          following
        }
      }
    default:
      return state;
  }
}
