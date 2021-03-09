import React, { Component } from "react";
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from "react-toastify";
import TabMenu from '../../tab_menu/route';
import ListData from './list';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
                                    onClick={this.goTo.bind(this, 'back')}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <TabMenu title='Training' selected='User'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import User</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <button className="button-bordered">
                                                            <i
                                                                className="fa fa-download"
                                                                style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                            />
                                                            Download Template
                                                        </button>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <button className="button-bordered-grey">
                                                            Choose
                                                        </button>
                                                        <button className="button-gradient-blue" style={{marginLeft:20}}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            Upload File
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <ListData goTo={this.goTo.bind(this)}/>
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

export default User;
