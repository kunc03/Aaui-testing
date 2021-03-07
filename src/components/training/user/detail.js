import React, { Component } from "react";
import { toast } from "react-toastify";
import FormUser from "./form";

class DetailUser extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack() {
    this.props.history.push('/training/user');
  }
  render() {
    return(
        <FormUser disabledForm={true} goBack={this.goBack.bind(this)}/>
    )
  }
}

export default DetailUser;
