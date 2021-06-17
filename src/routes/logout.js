import React from "react";

import API, { API_SERVER } from '../repository/api';
import Storage from '../repository/storage';

export default class Logout extends React.Component {
    constructor(props) {
      super(props);
  
      this.onClickLogout = this.onClickLogout.bind(this);
    }
  
    onClickLogout(e) {
      e.preventDefault();
    }
  
    componentDidMount() {
      const user_id = Storage.get('user').data.user_id;
      API.get(`${API_SERVER}v1/auth/logout/${user_id}`).then((res) => {
        localStorage.clear();
        window.location.href = window.location.origin;
      });
    }
  
    render() {
      return <div>Loading</div>;
    }
  }