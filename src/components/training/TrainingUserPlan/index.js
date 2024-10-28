import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { withRouter } from 'react-router-dom';
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

class TrainingUserPlan extends Component {
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
  getDataOrganizer(){
    const idCompany = Storage.get('user').data.company_id;
    API.get(`${API_SERVER}v2/training/settings/organizer/${idCompany}`).then(res=>{
      let tempData = [{label: 'All', idOrganizer: 0, image: null}];
      res.data.result.forEach(element => {
        tempData.push({
          label: element.name,
          idOrganizer: element.id,
          image: element.logo
        })
        this.setState({userDashboardMenu: tempData})
      });
    })
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
    let urlCheck =  `${API_SERVER}v2/training/plan/${idCompany}${tab.idOrganizer === 0 ? '' : `?organizer=${tab.idOrganizer}`}`;
    
    API.get(urlCheck).then(res=>{
      if(res.data.error){
        toast.error('Error fetch data plan');
      }else{
        let resDat = res.data.result.data;
        let tmp = [];
        
        if(resDat.length){
          
          resDat.forEach((item)=>{
            
            let splitDuration = '';
            let examCount = [];
            let liveclassCount = [];
            let submissionCount = [];

            if(item.duration){
              splitDuration = item.duration.split(":");
              item.durationString =`${splitDuration[0]} Hours ${splitDuration[1]} Minutes`;
            }else{
              item.durationString = splitDuration;
            }
            item.fileCount = [];
            if(item.content){
              item.fileCount = item.content.split(',');
            }

            // count exam and liveclass
            examCount = item.exam;
            liveclassCount = item.liveclass;
            submissionCount = [];

            tmp.push({
              "id": item.id,
              "title": item.title,
              "image":  item.image,
              "status": item.progress == 100 ? 'Done' : 'Active',
              "totalItem": {
                  "file": item.fileCount.length,
                  "exam": examCount.length,
                  "liveclass": liveclassCount.length,
                  "submission": submissionCount.length

              },
              "duration": item.durationString,
              "progress": item.progress
            })
          });
          this.setState({ listHistoryUser: tmp });
        }
      }
      this.setState({isLoading: false});
      // console.log("TEST")
    });
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  componentDidMount() {
    this.getDataUserDashboard();
    this.getDataOrganizer();
    if(!Storage.get('dataAddressCompleted')){
     this.props.history.push('/pengaturan')
    }
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
                      <TabMenu title='Training' selected='Course' />
                      <div>
                        <LoadingOverlay
                          active={this.state.isLoading}
                          spinner={<BeatLoader size='30' color='#008ae6' />}
                        >
                          <div className="card p-20 main-tab-container">
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                              <ul className="tab-menu-training" style={{float:'none', marginTop:0, padding: 0, marginBottom:30}}>
                                  {
                                      this.state.userDashboardMenu.map(item =>
                                        <li className={`liUserTabFont ${this.state.selectedTab === item.label && 'active'}`} onClick={this.getDataUserDashboard.bind(this, item)}>
                                          {
                                            item.label === 'All'
                                            ? null
                                            : <img src={item.image} style={{height: 34, marginRight: 10}}/>
                                          }
                                            {item.label}
                                        </li>
                                      )
                                  }
                              </ul>
                              <input
                                type="text"
                                placeholder="Search"
                                onChange={this.filter}
                                className="form-control float-right col-sm-3" 
                                
                              />

                              <div className="card-columns">
                                {listHistoryUser.length ? 
                                  listHistoryUser.map((history, index) => {
                                    let useColor = currentColor;
                                    currentColor = currentColor === 2 ? 0 : currentColor + 1;
                                      return (
                                        <div className={`card divBackgroundAccess divBackgroundAccess`} style={{cursor:'pointer', boxShadow:'none', backgroundColor: bgColor[useColor].bg}} onClick={() => window.open(this.state.urlDetail+'/'+history.id, '_blank').focus()}>
                                          <div className="card-body" style={{display: 'flex', padding: "15px 10px"}}>
                                            <div class="col-sm" style={{flexGrow: 0}}>
                                              <img alt={history.title} height={75} width={76} src={history.image ? history.image : 'assets/images/no-image.png'}/>
                                            </div>
                                            
                                            <div className="col-sm" style={{padding:0,width:330}}>
                                              <h5 className={`card-title fontTitleAccess`} style={{color: bgColor[useColor].color}}>{history.title}</h5>
                                                <p className="card-text fontDefault"> <img alt="plan-book" src={`newasset/book.png`} style={{marginTop: -3}} /> {history.totalItem.file} Files, {history.totalItem.exam} Exam, {history.totalItem.liveclass} Liveclass
                                                {/* , {history.totalItem.submission} Submission */}
                                                </p>
                                                <p className="card-text fontDefault"> <img alt="exam-clock" src={`newasset/clock.png`} style={{marginTop: -3}} /> {history.duration}</p>
                                            </div>
                                          </div>
                                            <div className="card-footer" style={{ padding: "10px"}}>
                                              <div className="col-sm d-flex m-b-10" style={{justifyContent: "flex-end"}}>
                                                <div className="buttonActive fontWhite" style={{backgroundColor:history.status === 'Done'? "#00B187" : history.status === 'Inactive' ? "#CB0000" : "#0072D8"}}>{history.status}</div>
                                              </div>
                                              <div className="col-sm" style={{backgroundColor: "#D8D8D8", padding: 0, borderRadius: 12}}>
                                                <div className="w3-grey" style={{backgroundColor: history.progress <= 0 ? "#D8D8D8" : history.progress > 0 && history.progress < 100 ? "#FF9900" : "#42D8B5", width:history.progress+'%', height:15, borderRadius:12}}></div>
                                              </div>
                                          </div>
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

export default withRouter(TrainingUserPlan);
