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
import { Modal } from 'react-bootstrap';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import "../TrainingUserDashboard/traininguserdashboard.css";

class TrainingUserMembership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex:null,
      listHistoryUser: [],//require('./arr-dummy').arr,
      isLoading: false,
      urlDetail:`/training/detail-course`,
      filter: '',
      selectedTab: 'All',
      modalActive: false,
      selectedHistory: {},
      updateMembership: false,
      image: '', 
      imagePreview:'assets/images/no-image.png',
      isSaving:false,
      idMembership:'',
      userDashboardMenu: [],
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    // if (sessionStorage.new_tab) {
      // this.props.history.push('/');
    // } else {
      this.props.history.goBack();
    // }
  }
  getDataUserDashboard (tab) {
    if (!tab){
      tab = {
        label: 'All',
        idOrganizer: 0
      }
    }
    const idCompany = Storage.get('user').data.company_id;
    this.setState({isLoading: true, selectedTab: tab.label});
    let urlCheck =  `${API_SERVER}v2/training/membership/get-all-license-card/${Storage.get('user').data.training_user_id}`;
    
    API.get(urlCheck).then(res=>{
      if(res.data.error){
        toast.error('Error fetch data plan');
      }else{
        this.setState({listHistoryUser: res.data.result});
      }
      this.setState({isLoading: false});
      console.log("TEST")
    });
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  componentDidMount() {
    this.getDataUserDashboard();
  }


  render() {
    let { listHistoryUser,filter } = this.state;
    if (filter !== "") {
      listHistoryUser = listHistoryUser.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }

    let bgColor = [
      { bg: '#E7F8FF', color: '#52A2C3' },
      { bg: '#FFF3ED', color: '#EC9B73' },
      { bg: '#FFF6F8', color: '#D87C96' },
    ];
    let currentColor = 0;
    const idTrainingUser = Storage.get('user').data.training_user_id;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  {/* <div className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                      onClick={this.goBack}
                    ></img>
                  </div> */}
                  <div className="row">
                    <div className="col-xl-12">
                      <TabMenu title='Training' selected='Membership' />
                      <div>
                        <LoadingOverlay
                          active={this.state.isLoading}
                          spinner={<BeatLoader size='30' color='#008ae6' />}
                        >
                          <div className="card p-20 main-tab-container">
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                              <input
                                type="text"
                                placeholder="Search"
                                onChange={this.filter}
                                className="form-control float-right col-sm-3" 
                                
                              />
                              </div>
                            </div>
                            <div className="row">
                            <div className="p-20">
                              <div className="row">
                                {listHistoryUser.length ? 
                                  listHistoryUser.map((history, index) => {
                                      return (
                                        <div className="col-md-4 col-sm-12 mb-3">
                                            <a href={history.license_card} target="_blank">
                                                <img style={{maxWidth: '100%'}} src={history.license_card} />
                                            </a>
                                        </div>
                                      )
                                  })
                                :<div><div style={{padding: 24}}>{ this.state.isLoading ? 'Loading Fetch Data' : 'There are no records to display' }</div></div>}
                              </div>
                              
                              </div>
                            </div>
                          </div>
                        </LoadingOverlay>
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

export default TrainingUserMembership;
