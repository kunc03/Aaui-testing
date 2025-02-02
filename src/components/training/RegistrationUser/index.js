import React, { Component } from 'react';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from 'react-toastify';
import TabMenu from '../../tab_menu/route';
import ListData from './list';
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import TabMenuReport from '../../tab_menu/route_plan';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      training_company_id: '',
      isLoading: false,
    };
  }

  goTo(url) {
    if (url === 'back') {
      this.props.history.goBack();
    } else {
      this.props.history.push(url);
    }
  }

  fetchDataUser() {
    this.setState({ isLoading: true });
    API.get(`${API_SERVER}v2/training/user/read/user/${Storage.get('user').data.user_id}`).then((res) => {
      if (res.status === 200) {
        this.setState({ training_company_id: res.data.result.training_company_id, isLoading: false });
      }
    });
  }

  componentDidMount() {
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training'){
      this.fetchDataUser();
    }
  }

  render() {
    return (
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
                      <TabMenuReport title='Training' selected='Pending Users' access="users" />
                      <div>
                        {!this.state.isLoading ? (
                          <ListData
                            goTo={this.goTo.bind(this)}
                            trainingCompany={this.state.training_company_id !== '' ? this.state.training_company_id : 0}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
