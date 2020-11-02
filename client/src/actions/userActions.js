import axios from 'axios';
import jwt from 'jsonwebtoken';
import { push } from 'connected-react-router';

import { LOGIN_USER, LOGOUT_USER, GET_USER, 
  ADD_TWEET, REMOVE_TWEET, ADD_LIKED, REMOVE_LIKED,
  UPDATE_USER_IMAGE, FOLLOW_USER, UNFOLLOW_USER } from './types';

export const loginUser = (userId) => dispatch => {
  dispatch({
    type: LOGIN_USER
  });

  axios.get(`/api/user/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  })
    .then(res => {
      dispatch({
        type: GET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('userToken');
  dispatch({
    type: LOGOUT_USER
  });
}

export const checkLogin = () => dispatch => {
  const decoded = jwt.decode(localStorage.getItem('userToken'));
  if (decoded) {
    axios.get(`/api/user/${decoded.userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    })
      .then(res => {
        dispatch({
          type: LOGIN_USER
        });
        dispatch({
          type: GET_USER,
          payload: res.data
        });
      })
      .catch(err => {
        dispatch(push('/login'));
        console.log(err);
      });
  } else {
    dispatch(push('/login'));
  }
}

export const addTweet = (tweetId) => (dispatch) => {
  dispatch({
    type: ADD_TWEET,
    payload: tweetId
  });
}

export const removeTweet = (tweetId) => (dispatch) => {
  dispatch({
    type: REMOVE_TWEET,
    payload: tweetId
  });
}

export const addLiked = (tweetId) => (dispatch) => {
  dispatch({
    type: ADD_LIKED,
    payload: tweetId
  });
}

export const removeLiked = (tweetId) => (dispatch) => {
  dispatch({
    type: REMOVE_LIKED,
    payload: tweetId
  });
}

export const updateUserImage = (image) => (dispatch) => {
  dispatch({
    type: UPDATE_USER_IMAGE,
    payload: image
  });
}

export const addFollowing = (name) => (dispatch) => {
  dispatch({
    type: FOLLOW_USER,
    payload: name
  });
}

export const removeFollowing = (name) => (dispatch) => {
  dispatch({
    type: UNFOLLOW_USER,
    payload: name
  });
}
