import React, { Component } from "react";
import FormCompany from "./form";
import Allocation from "./allocation";
import ListData from "../user/list";
import TabMenu from '../../tab_menu/route';

class DetailCompany extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack() {
    this.props.history.push('/training');
  }
  goEdit() {
    this.props.history.push(`/training/company/edit/${this.props.id}`);
  }
  goTo(url) {
    if (url === 'back'){
      this.props.history.goBack();
    }
    else{
      this.props.goTo(url);
    }
  }
  render() {
    return(
      <div className="pcoded-main-container">
      <div className="pcoded-content">
                                {/* <div className="floating-back">
                                    <img
                                    src={`newasset/back-button.svg`}
                                    alt=""
                                    width={90}
                                    onClick={this.goTo.bind(this, 'back')}
                                    ></img>
                                </div> */}
        <div className="row">
            <div className="col-xl-12">
              <TabMenu title='Training' selected='My Company'/>
            </div>
        </div>
      </div>
      <FormCompany disabledForm={true} match={{params:{}}} id={this.props.id} goEdit={this.goEdit.bind(this)} goBack={this.goBack.bind(this)} lockEdit={true}/>
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
              <div className="pcoded-contents">
                  <div className="pcoded-inner-content">
                      <div className="main-body">
                          <div className="page-wrapper">
                          <div className="pcoded-content">
                              <div className="row">
                                  <div className="col-xl-12">
                                      <div className="row">
                                        <div className="col-sm-6">
                                          <Allocation trainingCompany={this.props.id} lockEdit={true} />
                                        </div>
                                        <div className="col-sm-6">
                                          <ListData goTo={this.goTo.bind(this)} trainingCompany={this.props.id} level="admin" import={true}/>
                                          <ListData goTo={this.goTo.bind(this)} trainingCompany={this.props.id} level="user" import={true}/>
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
      </div>
    )
  }
}

export default DetailCompany;
