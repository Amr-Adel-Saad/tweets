import {
  LOGIN_USER, LOGOUT_USER, GET_USER,
  ADD_TWEET, REMOVE_TWEET, ADD_LIKED, REMOVE_LIKED,
  UPDATE_USER_IMAGE, FOLLOW_USER, UNFOLLOW_USER
} from '../actions/types';

const initialState = {
  isLogged: false,
  userData: ''
};

export default function (state = initialState, action) {
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
    case ADD_TWEET:
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: [action.payload, ...state.userData.tweets]
        }
      };
    case REMOVE_TWEET:
      let tweets = state.userData.tweets;
      let x = tweets.indexOf(action.payload);
      tweets.splice(x, 1);

      return {
        ...state,
        userData: {
          ...state.userData,
          tweets
        }
      }
    case ADD_LIKED:
      return {
        ...state,
        userData: {
          ...state.userData,
          likes: [action.payload, ...state.userData.likes]
        }
      };
    case REMOVE_LIKED:
      let likes = state.userData.likes;
      let y = likes.indexOf(action.payload);
      likes.splice(y, 1);

      return {
        ...state,
        userData: {
          ...state.userData,
          likes
        }
      }
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
