import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';
import Webinars from '../../webinar/webinar';

class Webinar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [],
        filter:''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  componentDidMount(){
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  render() {
    let {data, filter} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
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
                                        <TabMenu title='Training' selected='Webinar'/>
                                        <div>
                                                        <Webinars access_project_admin={access_project_admin} titleColor='black' training={true}/>
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

export default Webinar;
