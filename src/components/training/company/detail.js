import React, { Component } from "react";
import FormCompany from "./form";
import Allocation from "./allocation";
import ListData from "../user/list"

class DetailCompany extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack() {
    this.props.history.push('/training/company');
  }
  goEdit() {
    this.props.history.push(`/training/company/edit/${this.props.match.params.id}`);
  }
  goTo(url) {
    if (url === 'back'){
      this.props.history.goBack();
    }
    else{
      this.props.history.push(url);
    }
  }
  render() {
    return(
      <div className="pcoded-main-container">
      <FormCompany disabledForm={true} id={this.props.match.params.id} goEdit={this.goEdit.bind(this)} goBack={this.goBack.bind(this)}/>
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
              <div className="pcoded-content">
                  <div className="pcoded-inner-content">
                      <div className="main-body">
                          <div className="page-wrapper">
                              <div className="row">
                                  <div className="col-xl-12">
                                      <div className="row">
                                        <div className="col-sm-6">
                                          <Allocation trainingCompany={this.props.match.params.id} />
                                        </div>
                                        <div className="col-sm-6">
                                          <ListData goTo={this.goTo.bind(this)} trainingCompany={this.props.match.params.id} level="admin" import={true}/>
                                          <ListData goTo={this.goTo.bind(this)} trainingCompany={this.props.match.params.id} level="user" import={true}/>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-sm-12">
                                        </div>
                                      </div>
                                  </div>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DetailCompany;
