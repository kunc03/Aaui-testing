import API, { USER_ME } from '../repository/api';
import Storage from '../repository/storage';

export const initUser = () => {
  return (dispatch) => {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      dispatch({ type: "GET_USER", payload: res.data.result});
    })
  }
}
