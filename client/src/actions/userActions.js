import axios from 'axios';
import jwt from 'jsonwebtoken';
import { push } from 'connected-react-router';

import { LOGIN_USER, LOGOUT_USER, GET_USER_DATA } from './types';

export const loginUser = (name) => dispatch => {
  dispatch({
    type: LOGIN_USER
  });

  axios.get(`/api/user/profile/${name}`, { headers: {
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
  }})
    .then(res => {
      dispatch({
        type: GET_USER_DATA,
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
    axios.get(`/api/user/profile/${decoded.name}`, { headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }})
      .then(res => {
        if (res.status === 401) {
          dispatch(push('/login'));
          console.log(res.data);
        } else {
          dispatch({
            type: LOGIN_USER
          });
          dispatch({
            type: GET_USER_DATA,
            payload: res.data
          });
        }
      })
      .catch(err => {
        dispatch(push('/login'));
        console.log(err);
      });
  } else {
    dispatch(push('/login'));
  }
}