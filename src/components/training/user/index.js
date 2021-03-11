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
                                            <ListData goTo={this.goTo.bind(this)} import={true}/>
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
