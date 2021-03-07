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
  render() {
    return(
        <FormCompany disabledForm={true} goBack={this.goBack.bind(this)}/>
    )
  }
}

export default DetailCompany;
