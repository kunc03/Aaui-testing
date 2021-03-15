import React, { Component } from "react";
import { flex } from "styled-system";
import Storage from '../../repository/storage';
import TabMenu from '../tab_menu/hash';
import Company from './company_bak';

class Training extends Component {
  constructor(props) {
    super(props);
    this.state = {
        menu : [
            {
                label: 'Company',
                icon: 'company.svg',
                iconActive: 'company-active.svg'
            },
            {
                label: 'User',
                icon: 'company.svg',
                iconActive: 'user-active.svg'
            },
            {
                label: 'Theory',
                icon: 'theory.svg',
                iconActive: 'theory-active.svg'
            },
            {
                label: 'Practice',
                icon: 'practice.svg',
                iconActive: 'practice-active.svg'
            },
            {
                label: 'Exam',
                icon: 'exam.svg',
                iconActive: 'exam-active.svg'
            },
            {
                label: 'Webinar',
                icon: 'webinars.svg',
                iconActive: 'webinars-active.svg'
            },
            {
                label: 'Membership',
                icon: 'membership.svg',
                iconActive: 'membership-active.svg'
            }
        ],
        selectedMenu: 'Company'
    }
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    this.props.history.goBack();
  }

  selectMenu(label){
      this.setState({
          selectedMenu: label
      })
      window.location.href=`training#${label}`
  }

  renderContent(param){
      switch (param){
          case 'Company' : return <Company/>;
          default : return null;
      }
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return(
        <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
                <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                        <div className="main-body">
                            <div className="page-wrapper">
                                <div className="floating-back">
                                    <img
                                    src={`newasset/back-button.svg`}
                                    alt=""
                                    width={90}
                                    onClick={this.goBack}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <TabMenu title='Training' menu={this.state.menu} selected={this.state.selectedMenu} selectMenu={this.selectMenu.bind(this)}/>
                                        {this.renderContent(this.state.selectedMenu)}
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

export default Training;
