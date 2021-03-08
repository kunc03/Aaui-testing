import React, { Component } from "react";
import { toast } from "react-toastify";
import FormCompany from "./form";

class DetailCompany extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack() {
    this.props.history.push('/training');
  }
  goEdit() {
    this.props.history.push(`/training/company/edit/${this.props.match.params.id}`);
  }
  render() {
    return(
        <FormCompany disabledForm={true} id={this.props.match.params.id} goEdit={this.goEdit.bind(this)} goBack={this.goBack.bind(this)}/>
    )
  }
}

export default DetailCompany;
