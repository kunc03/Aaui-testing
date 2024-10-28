import React, { Component } from "react";
import { toast } from "react-toastify";
import FormUser from "./form";

class DetailUser extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack() {
    this.props.history.goBack();
  }
  goEdit() {
    this.props.history.push(`/training/user/edit/${this.props.match.params.id}`);
  }
  render() {
    return(
        <FormUser match={{params:{level: ''}}} disabledForm={true} id={this.props.match.params.id} goEdit={this.goEdit.bind(this)} goBack={this.goBack.bind(this)}/>
    )
  }
}

export default DetailUser;
