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
import "./traininguserdashboard.css"
import SocketContext from "../../../socket";

const userDashboardMenu = [{
  label: 'Exam',
},
{
  label: 'History',
}]

class TrainingUserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex:null,
      listHistoryUser: [],
      isLoading: false,
      filter: '',
      selectedTab: '',
      modalActive: false,
      selectedHistory: {},
      updateMembership: false,
      image: '', 
      imagePreview:'assets/images/no-image.png',
      isSaving:false,
      idMembership:'',
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
    this.setState({isLoading: true, selectedTab: tab});
    const idCompany = Storage.get('user').data.company_id;
    const idTrainingUser = Storage.get('user').data.training_user_id;
    let urlHitPoint = '';

    let urlCheck =  `${API_SERVER}v2/training/check-user-membership/${idTrainingUser}`;
    
    API.get(urlCheck).then(res=>{
      if(res.data.error){
        toast.error('Error Get Data History User..');
      }else{
        let resDat = res.data;
        if(resDat.result.membership_id && resDat.result.membership_id !== 'nopending'){
            this.setState({ idMembership:resDat.result.membership_id,exam_result_id:resDat.result.exam_result_id,updateMembership:true });
        }
      }
    });

    if(tab === 'Exam'){
      urlHitPoint = `${API_SERVER}v2/training/exam-by-user/${idTrainingUser}/${idCompany}/${1}`;
    }else{
      urlHitPoint = `${API_SERVER}v2/training/exam-history-by-user/${idTrainingUser}/${idCompany}/${1}`
    }


    API.get(urlHitPoint).then(res => {
      if(res.data.error){
        toast.error('Error Get Data History User..');
      }
      this.setState({listHistoryUser: res.data.result});
      this.setState({isLoading: false});

    })
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  componentDidUpdate(){
    this.props.socket.on('WEB::read_training_user_dashboard', (data) => {
      const idCompany = Storage.get('user').data.company_id;
      const idTrainingUser = Storage.get('user').data.training_user_id;
      data = data.data;
      if (data.user_id === idTrainingUser && data.company_id == idCompany) {
        if (data.action === 'Exam') {
          this.getDataUserDashboard('Exam');
        }
      }
    });
  }
  componentDidMount() {
    this.getDataUserDashboard('Exam');
  }

  closeModalActivate = e => {
    this.setState({ modalActive: !this.state.modalActive })
  }

  closeModalMembership = e => {
    this.setState({ updateMembership: !this.state.updateMembership })
  }
  handleChange = e => {
    let {name, value} = e.target;
    if (name==='image'){
      if (e.target.files.length){
          if (e.target.files[0].size <= 5000000) {
              let image = {
                  image: e.target.files[0],
                  imagePreview: URL.createObjectURL(e.target.files[0])
              }
              this.setState(image)
          } else {
            e.target.value = null;
            toast.warning('Image size cannot larger than 5MB and must be an image file')
          }
      }
    }
    else{
        this.setState({[name]: value})
    }
 }

 save = (e) =>{
  e.preventDefault();
  this.setState({isSaving: true})
  if (this.state.image){
      let formData = new FormData();
      formData.append("photo", this.state.image)
      API.put(`${API_SERVER}v2/training/membership/photo/${this.state.idMembership}`, formData).then(res2 => {
          if (res2.data.error){
              toast.warning('Fail to upload image. Please Try Again.')
              this.setState({isSaving: false});
              // this.closeModalMembership.bind(this)()
          }
          else{
              toast.success('Membership edited')
              this.setState({isSaving: false});
              this.closeModalMembership.bind(this)()
          }
      })
  }
  else{
      toast.success('Membership edited')
      this.setState({isSaving: false});
      this.closeModalMembership.bind(this)()
  }
}

overview (history, index) {
  if(history.on_schedule === '0'){
    toast.warning(history.message || 'The exam is not available because you do not match the requirements of this exam');
  }else{
    if(history.access){
      this.setState({modalActive: history.access, selectedHistory: history, selectedIndex:index});
    }else{
      toast.warning('Sorry, you cant access this exam')
    }
  }
}

  render() {
    //console.log(this.state,'??')
    let { listHistoryUser, filter } = this.state;
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
                      <TabMenu title='Training' selected='Exam' />
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
                                      userDashboardMenu.map(item =>
                                        <li className={`liUserTabFont ${this.state.selectedTab === item.label && 'active'}`} onClick={this.getDataUserDashboard.bind(this, item.label)}>
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
                                    if(this.state.selectedTab === 'Exam') {
                                      return (
                                        <div className={`card divBackgroundAccess ${!history.access || history.on_schedule === '0' ? 'divBackgroundRestrict' : 'divBackgroundAccess' }`} style={{boxShadow:'none', backgroundColor: bgColor[useColor].bg}}>
                                          <div className="card-body" style={{display: 'flex', padding: "15px 10px"}}>
                                            <div class="col-sm" style={{flexGrow: 0}}>
                                              <img height={75} width={76} src={history.image ? history.image : 'assets/images/no-image.png'}/>
                                            </div>
                                            
                                            <div class="col-sm">
                                              <h5 className={`card-title ${!history.access || history.on_schedule === '0' ? 'fontTitleRestrict' : 'fontTitleAccess' }`} style={{cursor:'pointer', color: bgColor[useColor].color}} onClick={this.overview.bind(this, history, index)}>{history.title}</h5>
                                                <p className="card-text fontDefault"> <img alt="exam-clock" src={`newasset/clock.png`} style={{marginTop: -3}} /> {history.time_limit} Minutes</p>
                                              </div>
                                            </div>
                                            <div className="card-footer" style={{display: 'flex', padding: "10px"}}>
                                              {history.scheduled ?
                                              <>
                                                <div class="col-sm">
                                                  <span className="fontDefaultGrey">Open <br/></span>
                                                  <span className="fontDefaulBold">{moment(history.start_time).local().format("HH:mm")} <br/></span>
                                                  <span className="fontDefaulBold">{moment(history.start_time).local().format("DD/MM/YYYY")}</span>
                                                </div>
                                                <div class="col-sm">
                                                  <span className="fontDefaultGrey">Close <br/></span>
                                                  <span className="fontDefaulBold">{moment(history.end_time).local().format("HH:mm")} <br/></span>
                                                  <span className="fontDefaulBold">{moment(history.end_time).local().format("DD/MM/YYYY")}</span>
                                                </div>
                                              </>
                                              : null}
                                              <div class="col-sm d-flex flex-row-reverse">
                                                {!history.access || history.on_schedule === '0' ? <img alt="exam-lock" src={`newasset/exam-lock.svg`} /> : <div className="buttonActive fontWhite no-pointer" style={{backgroundColor:history.availability === 'Processing'? "#fd7e14" : "#0072D8"  }}>{history.availability}</div>}
                                              </div>
                                          </div>
                                        </div>
                                      )
                                    }else{
                                      return ( 
                                        <div className={`card divBackgroundAccess`} style={{boxShadow:'none', backgroundColor: bgColor[useColor].bg}}>
                                          <div className="card-body" style={{display: 'flex', padding: "15px 10px"}}>
                                            <div class="col-sm" style={{flexGrow: 0}}>
                                              <img height={75} width={76} src={history.image ? history.image : 'assets/images/no-image.png'}/>
                                            </div>
                                            
                                            <div class="col-sm">
                                              <Link
                                                to={{
                                                  pathname: `/training/userhistory/${idTrainingUser}/${history.result_id}`,
                                                  state: history
                                                }}
                                              >
                                                <h5 className={`card-title fontTitleAccess`} style={{cursor:'pointer', color: bgColor[useColor].color}} onClick={() => this.setState({modalActive: true})}>{history.title}</h5>
                                              </Link>
                                              <p className="card-text fontDefault"> <img alt="exam-clock" src={`newasset/clock.png`} style={{marginTop: -3}} /> {history.time_limit} Minutes</p>
                                              <div className={`fontWhite ${history.pass ? 'buttonExamGreen' : 'buttonExamRed'}`}>{history.pass ? 'Passed' : 'Failed'}</div>
                                            </div>
                                          </div>
                                          <div className="card-footer" style={{display: 'flex', padding: "10px"}}>
                                            <>
                                              <div class="col-sm">
                                                <span className="fontDefaultGrey">Open<br/></span>
                                                <span className="fontDefaulBold">{moment(history.work_start_time).local().format("HH:mm")} <br/></span>
                                                <span className="fontDefaulBold">{moment(history.work_start_time).local().format("DD/MM/YYYY")}</span>
                                              </div>
                                              <div class="col-sm">
                                                <span className="fontDefaultGrey">Close <br/></span>
                                                <span className="fontDefaulBold">{moment(history.submission_time).local().format("HH:mm")} <br/></span>
                                                <span className="fontDefaulBold">{moment(history.submission_time).local().format("DD/MM/YYYY")}</span>
                                              </div>
                                            </>
                                            <div class="col-sm">
                                              <div className="detailResultScoreHeader" style={{width:100, background: history.pass ? '' : '#CF4D4E', color:history.pass ? '' : 'white'}}>Score</div>
                                              <div className="detailResultScoreBody" style={{width:100 , background: history.pass ? '' : '#FC7373', color:history.pass ? '' : 'white'}}>{history.score}</div>
                                              <div className="detailResultMinBody" style={{width:100 , background: history.pass ? '' : '#FC7373', color:history.pass ? '' : 'white'}}>Min. Score {history.minimum_score}</div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    
                                  })
                                :<div><div style={{padding: 24}}>There are no records to display</div></div>}
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
        
        <Modal show={this.state.updateMembership} centered>
          <Modal.Header>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>

            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='imageFormExamPreview' style={{width: 500}}>
                  <center>
                  <div className="fontDefaulBold" for="image">Member's Photo</div><br/>
                      <label style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                          <a href={this.state.imagePreview} target="_blank">
                              <img src={this.state.imagePreview} height="54.8px" />
                          </a>
                      </label>
                      <label for='image' style={{cursor:'pointer', overflow:'hidden', display: this.state.disabledForm ? 'none' : 'block'}}>
                          <div className="button-bordered-grey" style={{width:"30%"}}>
                              {this.state.image ? this.state.image.name : 'Choose file'}
                          </div>
                      </label>
                  </center>
                  <input type="file" style={{display: 'none'}} accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
              </div>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: 'center' }}>
            {/* <button className="btn btn-icademy-primary width200" onClick={() => {
              window.location.href = `/training/userhistory/${this.state.userId}/${this.state.idHistoryAssignee}`;
            }}>
              Next
            </button> */}
            <button
              disabled={this.state.isSaving}
              onClick={this.save}
              className="btn btn-icademy-primary float-right"
              style={{ padding: "7px 8px !important" }}>
                  <i className="fa fa-save"></i>
                  {this.state.isSaving ? 'Saving...' : 'Save'}
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.modalActive} onHide={this.closeModalActivate} centered>
          <Modal.Header>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
             
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="fontDefaulBold" style={{fontSize:20, textAlign:'center'}}>Are you sure to take this exam ?</div>
          </Modal.Body>
          <Modal.Footer style={{justifyContent:'center'}}>
            <button className="btn btm-icademy-primary btn-icademy-grey buttonBack width200" onClick={this.closeModalActivate.bind(this)}>
              Back
            </button>
            <a href={`/training/exam-user/${idTrainingUser}/${this.state.selectedHistory.assignee_id}?area=${this.props.socket.id}`}
              rel="noopener noreferrer"
              target={"_blank"}
              onClick={()=>{
                let history = this.state.listHistoryUser; 
                history[this.state.selectedIndex].availability = 'Processing'; 
                this.setState({ listHistoryUser:history })
              }}>
                
               <button className="btn btn-icademy-primary width200" onClick={this.closeModalActivate.bind(this)}>
               Yes
              </button>
            </a>

           
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
const TrainingUserDashboard_view = (props) => (
  <SocketContext.Consumer>{(socket) => <TrainingUserDashboard {...props} socket={socket} />}</SocketContext.Consumer>
);
export default TrainingUserDashboard_view;
