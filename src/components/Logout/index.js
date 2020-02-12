import React, {Component} from "react";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onClickLogout(e) {
    e.preventDefault();
  }

  componentDidMount() {
    localStorage.clear();
    window.location.href = window.location.origin;
  }

  render() {
    return <div></div>;
  }
}

export default Logout;