import React, { Component } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal } from 'react-bootstrap';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import "../TrainingUserDashboard/traininguserdashboard.css"

const userDashboardMenu = [{
  label: 'Session',
}];

const overviewMenu = [{
  label: 'Overview'
}]

class DetailCoursePlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewMedia:{ name:null,type:null,url:null,open:false,urlFlash:null,originUrl:null,session_id:null },
      selectedIndex:null,
      idCourse: this.props.match.params.idCourse || 0,
      listHistoryUser: require('./arr-dummy').detailDummy,
      currentStep:{ index:0,overview:null },
      isLoading: false,
      filter: '',
      selectedTab: 'Session',
      modalActive: false,
      selectedHistory: {},
      updateMembership: false,
      image: '', 
      imagePreview:'assets/images/no-image.png',
      isSaving:false,
      idMembership:'',
      modalSession: false,
      modalViewScore: false,
      modalViewSubmission: false,
      selectedAnswerMedia: [],
      selectedAnswerText: '',
      selectedSession: {
        media: []
      },
      totalSession: 0,
      totalExam: 0,
      totalLiveclass: 0,
      totalSubmission: 0,
      dummyMedia : require('./arr-dummy').detailDummy.session[0].media,
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

  stepPosition(data){

    data.agenda.forEach((item,index)=>{
      let overview = {};
      // overview content
      if(item.type.toLowerCase() === 'session'){
        overview = {
          type: item.type.toLowerCase(),
          content:item.content,
          file:item.media
        };
      }
      else if(item.type.toLowerCase() === 'exam'){
        overview = {
          type: item.type.toLowerCase(),
          content:item.overview,
          file:item.image
        };
      }

      // check position
      if(item.is_read == 0 && index == 0){
        this.setState({ currentStep:{
          index:index,
          overview:overview
        }})
      }else{
        // check before element
        if(item[index-1].is_read == 1){
          if(item.scheduled == 1 && item.is_read == 1){
            this.setState({ currentStep:{
              index:index,
              overview:overview
            }});
          }
        }
      }
    });
  }

  getDataDetailCoursePlan () {
    this.setState({isLoading: true});
    const idTrainingUser = Storage.get('user').data.training_user_id;

    let urlCheck =  `${API_SERVER}v2/training/plan/read/${this.state.idCourse}`;

    API.get(urlCheck).then(res => {
      if(res.data.error){
        toast.error('Error Get Data History User..');
      }

      let countAllAgenda = {
        totalSession: 0,
        totalExam: 0,
        totalLiveclass: res.data.result.liveclass.length,
        totalSubmission: 0
      };
      let tempAgenda = [...res.data.result.session, ...res.data.result.liveclass, ...res.data.result.exam];
      res.data.result.agenda = tempAgenda;
      const isAgendaAvailable = res.data.result.agenda.length;
      
      if(isAgendaAvailable) {
        res.data.result.agenda.forEach((agenda) => {
          if(agenda.type === 'Exam') {
            countAllAgenda.totalExam += 1;
          // } else if (agenda.type === 'Liveclass') {
            // countAllAgenda.totalLiveclass += 1;
          } else if (agenda.type === 'Theory' || agenda.type === 'Session') {
            countAllAgenda.totalSession += 1;
          } else if (agenda.type === 'Submission') { 
            countAllAgenda.totalSubmission += 1;
          }
        })
      }
      

      this.setState({listHistoryUser: res.data.result, ...countAllAgenda});
      this.setState({isLoading: false});

    })
  }

  componentDidMount() {
    this.getDataDetailCoursePlan();
  }

  closeModalActivate = e => {
    this.setState({ modalActive: !this.state.modalActive })
  }

  closeModalSession = e => {
    this.setState({ modalSession: !this.state.modalSession,previewMedia:{session_id : null, originUrl:null,name:null, type:null,url:null,open:false,urlFlash:null } })
  }

  onError = e => {
    console.log(e, "error in file-viewer");
  };

  formatDuration (stringTime) {
    if(stringTime === '-' || stringTime === '' || !stringTime ) return '-'
    const mom = moment(stringTime, 'HH:mm');
    return `${mom.format('H')} hours, ${mom.format('m')} minutes`;
  }

  closeModal(type) {
    if(type === 'view-score'){
      this.setState({modalViewScore: false})
    }else if(type === 'view-submission'){
      this.setState({modalViewSubmission: false})
    }
  }

  overviewModal (session, iconName, isRestrict) {
    const idTrainingUser = Storage.get('user').data.training_user_id;
    const listHistoryUser = this.state.listHistoryUser;
    if(iconName === `newasset/exam-lock.svg` || isRestrict){
      toast.warning(listHistoryUser.message || 'You do not match the requirements');
    } else if(iconName === `newasset/green-checklist.png`) {
      if(session.type === 'Session'){
        this.setState({
          modalSession: true,
          selectedSession: {...session}
        })
      }else if(session.type === 'Exam'){
        this.setState({
          modalViewScore: true,
          selectedSession: {...session, media: []}
        })
      }else if(session.type === 'Submission'){
        this.setState({
          modalViewSubmission : true, 
          selectedSession: {...session},
          selectedAnswerMedia: session.answerMedia.length ? session.answerMedia[0].submission_file ? JSON.parse(session.answerMedia[0].submission_file) : [] : [],
          selectedAnswerText: session.answerMedia.length ? session.answerMedia[0].submission_text : '',
        });
      }
    }else{
      if(session.type === 'Session'){

        const idTrainingUser = Storage.get('user').data.training_user_id;
        let urlCheck =  `${API_SERVER}v2/training/course/session/read`;
        API.post(urlCheck,{ session_id:session.id,training_user_id:idTrainingUser }).then(res => {
          if(res.data.error){
            toast.error('Error update session.');
          }else{
            this.getDataDetailCoursePlan();
          }
        })

        this.setState({
          modalSession: true,
          selectedSession: session
        })
      }else if(session.type === 'Exam'){
        window.open(`/training/exam-user/${idTrainingUser}/${session.assignee_id}`, '_blank');
      }else if(session.type === 'Submission'){

        const dateNow = moment(new Date(), 'MM-DD-YYYY HH:mm:ss');
        const dateSubmissionStart = moment(new Date(session.start_time), 'MM-DD-YYYY HH:mm:ss');
        const dateSubmissionEnd = moment(new Date(session.end_time), 'MM-DD-YYYY HH:mm:ss');
        const isDateInRange = dateNow.isBetween(dateSubmissionStart, dateSubmissionEnd);
        
        if(isDateInRange || !session.answerMedia.length ){
          window.open(`/training/user-submission/${idTrainingUser}/${session.id}`, '_blank');
        }else{
          // toast.warning('Submission already expired.');

          this.setState({
            modalViewSubmission : true, 
            selectedSession: {...session},
            selectedAnswerMedia: session.answerMedia.length ? session.answerMedia[0].submission_file ? JSON.parse(session.answerMedia[0].submission_file) : [] : [],
            selectedAnswerText: session.answerMedia.length ? session.answerMedia[0].submission_text : '',
          });
        }

      } else if(session.type === "Live Class"){
        window.open(`/webinar/live/${session.id}`, '_blank');
      } else{
        console.log('trueuuue')
      }
    }
  }

  accessSession(session, index) {
    const prevSession = this.state.listHistoryUser.agenda[index -1 ];
    const currentSession = session;
    const detailCourse = this.state.listHistoryUser;

    if(detailCourse.on_schedule === "1"){
      if(index === 0){ 
        return false;
      }else{
        if(prevSession.type === 'Exam' && prevSession.current_score < prevSession.minimum_score){
          return prevSession.repeatable ? false : true;
        }else if(currentSession.is_read){
          return false;
        }else if(prevSession.is_read){
          return false;
        }else{
          return true;
        }
      }
    }else{
      return true;
    }    
  }

  iconSession (session, index) {

    const prevSession = this.state.listHistoryUser.agenda[index -1 ];
    const currentSession = session;
    // const detailCourse = this.state.listHistoryUser;

    // `newasset/green-checklist.png`
    // `newasset/exam-lock.svg`
    // `newasset/overview-icon.png`
    if (index === 0){
      if(!currentSession.is_read) {
        return `newasset/overview-icon.png`
      } else if(currentSession.is_read) {
        return `newasset/green-checklist.png`
      }
    } else{
      if(prevSession.type === 'Exam' && prevSession.current_score < prevSession.minimum_score){
        if(prevSession.repeatable > 0){
          return `newasset/overview-icon.png`
        }else{
          return `newasset/exam-lock.svg`
        }
      }else if(index === 0 && !currentSession.is_read) {
        return `newasset/overview-icon.png`
      } else if(index === 0 && currentSession.is_read) {
        return `newasset/green-checklist.png`
      }else if(index !== 0 && currentSession.is_read){
        return `newasset/green-checklist.png`
      }else if (index !== 0 && !currentSession.is_read && prevSession.is_read) {
        return `newasset/overview-icon.png`
      }else{
        return `newasset/exam-lock.svg`
      }
    }
  }
  
  previewMedia(item,action){
    let objects = this.state.previewMedia;
    let type = null;

    if(action === 'download'){
      Axios({
        url: objects.originUrl,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', objects.name);
        document.body.appendChild(link);
        link.click();
        toast.info("Downloading file...");

      }).catch((e)=>{
        console.log(e,objects.url,"ERROR")
      });
    }else{
      if(action === 'open'){
        const url = item.url || item.fileLocation;
        type = item.type.toLowerCase();

        if(['ogg','mp4','mkv','webm'].indexOf(item.name.split(".")[1]) > -1){
          type = 'video';
        }


        objects.type = type;
        objects.open = true;
        objects.name = item.name;
        objects.originUrl = url;
        objects.session_id = item.session_id;
        console.log(action, type, item, url, objects, '???')
        
        if(type === 'video'){
          objects.ext = item.name.split(".")[1];
          objects.originUrl = item.url;
          objects.url = `"flash-player.swf?videoUrl=${item.url}"`;
          objects.urlFlash = `"controlbar=over&amp;image=img/poster.jpg&amp;file=flash-player.swf?videoUrl=${item.url}"`;
        }else if(type === 'pdf' || type === 'image' || url.substr(url.length - 4) === '.gif'){
          objects.url = url;
        }else{
          objects.url = `'https://view.officeapps.live.com/op/embed.aspx?src=${url}'`;
        }
      }else{
        objects = {session_id:null,name:null, type:null,url:null,open:false,urlFlash:null,originUrl:null };
      }
      this.setState({ previewMedia: objects });
    }
  }

  render() {
    let { listHistoryUser, filter } = this.state;

    if (filter !== "") {
      JSON.stringify(
          listHistoryUser = listHistoryUser.filter(x =>
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    const idTrainingUser = Storage.get('user').data.training_user_id;
    
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                <LoadingOverlay
                          active={this.state.isLoading}
                          spinner={<BeatLoader size='30' color='#008ae6' />}
                        >
                  <div className="row">
                    <div className="col-xl-12 card p-20">
                      <div className="main-tab-container">
                        <div className="row m-b-10 m-t-10" style={{ height: '100%' }}>
                            <div className="col-sm" style={{ display: 'flex', alignItems: 'center',marginTop:-20 }}>
                                <strong className="f-w-bold f-18" style={{ color: '#000' }}>{listHistoryUser.title}</strong>
                            </div>
                            <div className="col-sm">
                              <p className="card-text fontDefault m-b-0"> <img alt="exam-clock" src={`newasset/clock.png`} style={{marginTop: -3}} /> {this.formatDuration(listHistoryUser.duration)}</p>
                              <p className="card-text fontDefault m-b-0"> <img alt="plan-book" src={`newasset/book.png`} style={{marginTop: -3}} /> {this.state.totalSession} Theory, {this.state.totalExam} Exam, {this.state.totalLiveclass} Liveclass, {this.state.totalSubmission} Submission.</p>
                            </div>
                            <div className="col-sm">
                              On Progress
                                <div className="col-sm m-t-5" style={{backgroundColor: "#D8D8D8", padding: 0, borderRadius: 12}}>
                                  <div className="w3-grey" style={{backgroundColor: listHistoryUser.progress <= 0 ? "#D8D8D8" : listHistoryUser.progress > 0 && listHistoryUser.progress < 100 ? "#FF9900" : "#42D8B5", width:listHistoryUser.progress+'%', height:15, borderRadius:12}}></div>
                                </div>
                            </div>
                            <div className="col-sm-1">
                                <div className="col-sm d-flex m-b-10" style={{justifyContent: "flex-end", marginTop:18}}>
                                  <div className="buttonActive fontWhite" style={{paddingLeft: 10, paddingRight: 10, backgroundColor:listHistoryUser.status === 'Done'? "#00B187" : listHistoryUser.status === 'Inactive' ? "#CB0000" : "#0072D8"}}>{listHistoryUser.status}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                      <div>
                      </div>
                  </div>

                  <div className={"row"}>
                    <div className={"card col"} style={{paddingRight:"20px"}}>
                      <div className={"form-group"}>
                        <ul className="tab-menu-training" style={{float:'none', marginTop:0, padding: 0, marginBottom:30}}>
                            {
                                userDashboardMenu.map(item =>
                                  <li className={`liUserTabFont ${this.state.selectedTab === item.label && 'active'}`}>
                                      {item.label}
                                  </li>
                                )
                            }
                        </ul>

                        {
                        listHistoryUser.agenda.length ? 
                        listHistoryUser.agenda.map((session, index) => {
                          const isRestrict = this.accessSession(session, index);
                          const iconName = this.iconSession(session, index);
                          return (
                            <div id={session.id} className={`card ${isRestrict ? 'opacity-6' : ''}`} 
                              style={{padding:20, background: isRestrict ? "rgba(158, 158, 158, 0.20)" : 'rgba(249, 249, 249, 0.5)'}}>
                              <div className="row">
                                <div className={`col ${isRestrict ? '' : 'pointer'}`} 
                                  onClick={this.overviewModal.bind(this, session, iconName , isRestrict)}
                                  onMouseOver={()=>{
                                    if(!this.accessSession(session, index)){
                                      window.document.getElementById(session.id).style.backgroundColor = 'rgb(224 216 216 / 50%)'
                                    }
                                  }}
                                  onMouseLeave={()=>{
                                    if(!this.accessSession(session, index)){
                                      window.document.getElementById(session.id).style.backgroundColor = 'rgba(249, 249, 249, 0.5)'
                                    }
                                  }}
                                  >
                                <div className="buttonActive fontWhite m-b-10" style={{backgroundColor: session.type === "Session" ? "#55AFFF" : session.type === 'Submission' ? "#A56AF0" : "#FF9900" }}>{session.type === 'Session' ? 'Theory' : session.type}</div>
                                  <strong className="f-w-bold f-18 m-b-10" style={{ color: '#000' }}>{session.title}</strong>
                                  <p className="card-text fontDefault m-t-10"> <img alt="exam-clock" src={`newasset/clock.png`} style={{marginTop: -3}} /> {this.formatDuration(session.duration)}</p>
                                  <p className="card-text fontDefault m-t-10">{listHistoryUser.message || ''}</p>
                                </div>
                                {session.type === 'Session' ?
                                  <div className="col-sm-3">
                                    <div className="m-b-5">Media</div> <br/>
                                    <strong className="f-w-bold f-18" style={{ color: '#000' }}>{session.media.length}</strong>
                                  </div>
                                  :
                                  <div className="col-sm-3 d-flex">
                                    <div class="col-sm">
                                      <span className="fontDefaultGrey">Open<br/></span>
                                      <span className="fontDefaulBold">{session.start_time ? moment(session.start_time).local().format("HH:mm") : '-'} <br/></span>
                                      <span className="fontDefaulBold">{session.start_time ? moment(session.start_time).local().format("DD/MM/YYYY") : ''}</span>
                                    </div>
                                    <div class="col-sm ">
                                      <span className="fontDefaultGrey">Close <br/></span>
                                      <span className="fontDefaulBold">{session.end_time ? moment(session.end_time).local().format("HH:mm") : '-'} <br/></span>
                                      <span className="fontDefaulBold">{session.end_time ? moment(session.end_time).local().format("DD/MM/YYYY") : ''}</span>
                                    </div>
                                  </div>
                                }
                                
                                <div className="col-sm-2 d-flex" style={{alignItems:'center'}}>
                                  <img className="pointer" src={iconName} height="40" alt={iconName} onClick={this.overviewModal.bind(this, session, iconName , isRestrict) } />
                                  {
                                    session.is_read && session.repeatable ?
                                      <img className="pointer" src={'newasset/overview-icon.png'} height="40" style={{marginLeft:10}} alt={'newasset/overview-icon.png'} onClick={this.overviewModal.bind(this, session, 'newasset/overview-icon.png' , isRestrict) } />
                                    : null
                                  }
                                  {/* {isRestrict || session.is_read ? <img className="pointer" src={`newasset/green-checklist.png`} height="40" alt="green-checklist" onClick={this.overviewModal.bind(this, session) } /> : isRestrict || !session.is_read ? <img className="pointer" alt="exam-lock" src={`newasset/exam-lock.svg`} height="40" onClick={() => toast.warning('you dont have access..')}/> : <img className="pointer" alt="overview-icon" src={`newasset/overview-icon.png`} onClick={this.overviewModal.bind(this, session) }/>} */}
                                </div>
                              </div>
                            </div>
                          )
                        }) : <div><div style={{padding: 24}}>{ this.state.isLoading ? 'Loading fetch data' : 'There are no records to display' }</div></div> }
                        
                      </div>
                    </div>
                    <div className={"col-sm-auto"}>
                    </div>
                    <div className="card col-sm-3">  
                        <div className="form-group">
                        <div className="p-10">
                          <img style={{maxWidth:"100%"}} src={listHistoryUser.image ? listHistoryUser.image : 'assets/images/no-image.png'} alt="overview-course"/>
                        </div>
                        <div className="f-w-bold f-18 m-b-10" style={{ color: '#000' }}>Overview</div>
                            <div className="m-b-10"style={{borderBottom: "5px solid #FF9900", width:80}}>
                            </div>
                            {
                            listHistoryUser.open ? 
                            <div className="iconDetailAnswer cursorPointer" style={{float:'right', height:20, marginTop:-35}} onClick={() => this.setState({listHistoryUser: {...listHistoryUser, open: false}})}>
                                <i className={"fa fa-caret-up"} />
                            </div>
                            :
                            <div className="iconDetailAnswer cursorPointer" style={{float:'right', height:20, marginTop:-35}} onClick={() => this.setState({listHistoryUser: {...listHistoryUser, open: true}  })}>
                                <i className={"fa fa-caret-down"} />
                            </div>

                            }
                        </div>
                        <div className={"p-10"}>
                        {
                          listHistoryUser.open && (
                          <div className={"col-sm p-10"} style={{paddingTop: 10}}>
                              
                              <div className={"m-b-10"} dangerouslySetInnerHTML={{__html: listHistoryUser.overview}} ></div>
                              
                          </div>)
                        }
                        </div>
                    </div>
                </div>

                </LoadingOverlay>    
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.modalViewSubmission} dialogClassName={"modal-lg"} style={{height:"auto"}} onHide={this.closeModal.bind(this, 'view-submission')}>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold">
              <div className="buttonActive fontWhite m-b-10" style={{backgroundColor: this.state.selectedSession.type === "Session" ? "#55AFFF" : this.state.selectedSession.type=== 'Submission' ? "#A56AF0" : "#FF9900" }}>{this.state.selectedSession.type === 'Session' ? 'Theory' : this.state.selectedSession.type}</div>
              <strong className="f-w-bold f-18 m-b-10" style={{ color: '#000' }}>{this.state.selectedSession.title}</strong>
            </Modal.Title>
          </Modal.Header>

          { // list file
              !this.state.previewMedia.open && (
                <Modal.Body>
                <div className="fontDefaulBold">Schedule:</div>
                <div>
                  <span className="fontDefaultGrey">Start: </span>
                  <span className="fontDefaulBold m-l-3">{this.state.selectedSession.start_time ? moment(this.state.selectedSession.start_time).local().format("HH:mm") : '-'} </span>
                  <span className="fontDefaulBold m-l-3 m-b-10">{this.state.selectedSession.start_time ? moment(this.state.selectedSession.start_time).local().format("DD/MM/YYYY") : ''}</span> <br/>
  
                  <span className="fontDefaultGrey">End: </span>
                  <span className="fontDefaulBold m-l-3">{this.state.selectedSession.end_time ? moment(this.state.selectedSession.end_time).local().format("HH:mm") : '-'} </span>
                  <span className="fontDefaulBold m-l-3 m-b-10">{this.state.selectedSession.end_time ? moment(this.state.selectedSession.end_time).local().format("DD/MM/YYYY") : ''}</span> <br/>
                </div>
                <div className="fontDefaulBold">Description</div>
                <div className={"m-b-10"} style={{ color: '#9e9e9e'}} dangerouslySetInnerHTML={{__html: this.state.selectedSession.content}} ></div>
  
                <div className="fontDefaulBold">Answer Text:</div>
                <div className={"m-b-10"} style={{ color: '#9e9e9e'}} >{this.state.selectedAnswerText}</div>
  
                <div className="fontDefaulBold">Attachments: </div>
                <div style={{width:470, fontFamily: 'Segoe UI',fontStyle: "normal",fontWeight: 400,fontSize: "18px",lineHeight: "24px", marginBottom: 15}}>
                  {this.state.selectedSession.media.map((coursefile, index) => {
                    var re = /(?:\.([^.]+))?$/;
  
                    coursefile.ext = re.exec(coursefile.name)[1];
                    return (
                      <div className="m-b-5" onClick={()=>this.previewMedia(coursefile,'open')} style={{cursor:"pointer"}}>
                        <img src={(coursefile.ext === 'png' ||
                      coursefile.ext === 'pdf' ||
                      coursefile.ext === 'doc' ||
                      coursefile.ext === 'docx' ||
                      coursefile.ext === 'ppt' ||
                      coursefile.ext === 'pptx' ||
                      coursefile.ext === 'rar' ||
                      coursefile.ext === 'zip' ||
                      coursefile.ext === 'jpg' ||
                      coursefile.ext === 'csv')
                    ? `assets/images/files/${coursefile.ext}.svg`
                    : 'assets/images/files/file.svg'} width="20" alt="file"/> &nbsp;
                      {coursefile.name}
                      </div>
                    )
                  })}
                </div>
  
                <div className="fontDefaulBold">User Submission: </div>
                <div style={{width:'inherit', fontFamily: 'Segoe UI',fontStyle: "normal",fontWeight: 400,fontSize: "18px",lineHeight: "24px", marginBottom: 15}}>
                  {this.state.selectedAnswerMedia.map((coursefile, index) => {
                    var re = /(?:\.([^.]+))?$/;
  
                    coursefile.ext = re.exec(coursefile.fileName)[1];
                    return (
                      <div className="m-b-5" onClick={()=>this.previewMedia(coursefile,'open')} style={{cursor:"pointer", wordWrap: 'break-word'}}>
                        <img src={(coursefile.ext === 'png' ||
                      coursefile.ext === 'pdf' ||
                      coursefile.ext === 'doc' ||
                      coursefile.ext === 'docx' ||
                      coursefile.ext === 'ppt' ||
                      coursefile.ext === 'pptx' ||
                      coursefile.ext === 'rar' ||
                      coursefile.ext === 'zip' ||
                      coursefile.ext === 'jpg' ||
                      coursefile.ext === 'csv')
                    ? `assets/images/files/${coursefile.ext}.svg`
                    : 'assets/images/files/file.svg'} width="20" alt="file"/> &nbsp;
                      {coursefile.fileName}
                      </div>
                    )
                  })}
                  </div>
                </Modal.Body>
              )
            }

            { // state open true
              this.state.previewMedia.open && (
              <Modal.Body>

                <div style={{width:"auto", fontFamily: 'Segoe UI',fontStyle: "normal",fontWeight: 400,fontSize: "18px",lineHeight: "24px"}}>
                {
                  
                  this.state.previewMedia.type === 'video' ?
                  <embed width='100%' height='80%' frameBorder='0'>
                  <figure id="videoContainer">
                    <video id="video" controls preload="metadata" poster="img/poster.jpg" width="100%" height="460px">
                        <source src={this.state.previewMedia.url} type="video/mp4" />
                      
                        <object type="application/x-shockwave-flash" data={this.state.previewMedia.url} width="100%" height="460px">
                          <param name="movie" value={this.state.previewMedia.url} />
                          <param name="allowfullscreen" value="false" />
                          <param name="wmode" value="transparent" />
                          <param name="flashvars" value={this.state.previewMedia.urlFlash} />
                        </object>
                    </video>
                  </figure>
                  </embed>
                  // <iframe width="100%" height="500"
                  //   src={this.state.previewMedia.originUrl + '?autoplay=1'} allow="autoplay" title={this.state.previewMedia.name}>
                  // </iframe>
                  :
                  <>
                    { /** Selain video */ }
                    <div dangerouslySetInnerHTML={{__html: `<embed src=${this.state.previewMedia.url} width='100%' height='460px' frameBorder='0'></embed>` }} ></div>
                  </>
                }
                </div>
              </Modal.Body>
              )
            }

            <Modal.Footer style={{justifyContent:'center'}}>
                {
                  this.state.previewMedia.open && (
                    <>                
                      <button className="btn btm-icademy-primary btn-icademy-grey buttonBack width200" onClick={()=>this.previewMedia(null,'close')}>
                        Back
                      </button>
                      <button className="btn btn-icademy-primary width200" onClick={()=>this.previewMedia(null,'download')}>
                        Download
                      </button>
                    </>
                  )
                }
            </Modal.Footer>
              
        </Modal>


        <Modal show={this.state.modalViewScore} dialogClassName={"modal-lg"} style={{height:"auto"}} onHide={this.closeModal.bind(this, 'view-score')}>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold">
              <div className="buttonActive fontWhite m-b-10" style={{backgroundColor: this.state.selectedSession.type === "Session" ? "#55AFFF" : this.state.selectedSession.type=== 'Submission' ? "#A56AF0" : "#FF9900" }}>{this.state.selectedSession.type === 'Session' ? 'Theory' : this.state.selectedSession.type}</div>
              <strong className="f-w-bold f-18 m-b-10" style={{ color: '#000' }}>{this.state.selectedSession.title}</strong>
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <div className="detailResultScoreHeader" style={{ width: 100, background: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' : '#CF4D4E', color: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' : 'white' }}>Score</div>
                <div className="detailResultScoreBody" style={{ width: 100, background: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' :'#FC7373', color: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' : 'white'}}>{this.state.selectedSession.current_score }</div>
                <div className="detailResultMinBody" style={{ width: 100, background: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' : '#FC7373' , color: this.state.selectedSession.current_score >= this.state.selectedSession.minimum_score ? '' : 'white' }}>Min. Score  {this.state.selectedSession.minimum_score }</div>
              </Modal.Body>
        </Modal>

        <Modal show={this.state.modalSession} className={"xlarge-modal"} style={{ height:"auto"}} onHide={this.closeModalSession}>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold">
              <div className="buttonActive fontWhite m-b-10" style={{backgroundColor: this.state.selectedSession.type === "Session" ? "#55AFFF" : this.state.selectedSession.type=== 'Submission' ? "#A56AF0" : "#FF9900" }}>{this.state.selectedSession.type === 'Session' ? 'Theory' : this.state.selectedSession.type}</div>
              <strong className="f-w-bold f-16 m-b-10" style={{ color: '#000' }}>{this.state.selectedSession.title}</strong>
              <div className="m-b-5 f-12">Media <b className="f-12" style={{ color: '#000' }}>{this.state.selectedSession.media.length} Files</b></div> 
            </Modal.Title>
          </Modal.Header>
          
            { // list file
              !this.state.previewMedia.open && (
              <Modal.Body className="d-flex">
                <div className="col-sm-8">
                  <div className={"m-b-10"} style={{ color: '#9e9e9e', minHeight: 600, overflow: 'auto' }} dangerouslySetInnerHTML={{__html: this.state.selectedSession.content}} ></div>
                </div>
                <div className="col-sm-4">
                  <div style={{width:'inherit', minHeight:600, fontFamily: 'Segoe UI',fontStyle: "normal",fontWeight: 200,fontSize: "14px",lineHeight: "24px"}}>
                  {this.state.selectedSession.media.map((coursefile, index) => {
                  var re = /(?:\.([^.]+))?$/;
                  
                  coursefile.ext = re.exec(coursefile.name)[1];
                  return (
                    <div className="m-b-5" onClick={()=>this.previewMedia(coursefile,'open')} style={{cursor:"pointer", wordWrap: 'break-word'}}>
                      <img src={(coursefile.ext === 'png' ||
                    coursefile.ext === 'pdf' ||
                    coursefile.ext === 'doc' ||
                    coursefile.ext === 'docx' ||
                    coursefile.ext === 'ppt' ||
                    coursefile.ext === 'pptx' ||
                    coursefile.ext === 'rar' ||
                    coursefile.ext === 'zip' ||
                    coursefile.ext === 'jpg' ||
                    coursefile.ext === 'csv')
                  ? `assets/images/files/${coursefile.ext}.svg`
                  : 'assets/images/files/file.svg'} width="20" alt="file"/> &nbsp;
                    <span style={{color:"#0091ff"}}>{coursefile.name}</span>
                    </div>
                  )
                  })}
                  </div>
                </div>
                
              </Modal.Body>
              )
            }

            { // state open true
              this.state.previewMedia.open && (
              <Modal.Body>

                <div style={{width:"auto",minHeight:600, fontFamily: 'Segoe UI',fontStyle: "normal",fontWeight: 400,fontSize: "18px",lineHeight: "24px"}}>
                {
                  
                  this.state.previewMedia.type.toLowerCase() === 'video' ?
                    <div dangerouslySetInnerHTML={{ __html:`
                      <embed width='100%' height='80%' frameBorder='0'>
                      <figure id="videoContainer">
                      <video id="video" controls preload="metadata" poster="img/poster.jpg" width="100%" height="460px">
                          <source src="${this.state.previewMedia.originUrl}" type="video/mp4" />
                          
                      </video>
                      </figure>
                      </embed>
                    ` }}>
                    </div>
                  :
                  <>
                    { /** Selain video */ }
                    <div dangerouslySetInnerHTML={{__html: `<embed src=${this.state.previewMedia.url} width='100%' height='600px' frameBorder='0'></embed>` }} ></div>
                  </>
                }
                </div>
              </Modal.Body>
              )
            }
          
          <Modal.Footer style={{justifyContent:'center'}}>
            {
              this.state.previewMedia.open && (
                <>                
                  <button className="btn btm-icademy-primary btn-icademy-grey buttonBack width200" onClick={()=>this.previewMedia(null,'close')}>
                    Back
                  </button>
                  <button className="btn btn-icademy-primary width200" onClick={()=>this.previewMedia(null,'download')}>
                    Download
                  </button>
                </>
              )
            }
            {/* <img
              alt="prev"
              className="calendar-arrow"
              src={`assets/new_ui/arrow-left-big.svg`}
              style={{ marginLeft: '1%', marginRight: '1%', width: '5%' }}
            />
            <div style={{height:10, width: 10, marginTop: 5, backgroundColor: "#005DFF", borderRadius:"50%"}}/>
            <div style={{height:10, width: 10, marginTop: 5, backgroundColor: "#bbb", borderRadius:"50%"}}/>
            <div style={{height:10, width: 10, marginTop: 5, backgroundColor: "#bbb", borderRadius:"50%"}}/>
            <img
              alt="next"
              className="calendar-arrow"
              src={`assets/new_ui/arrow-right-big-active.svg`}
              style={{ marginLeft: '1%', marginRight: '1%', width: '5%' }}
            /> */}
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.modalActive} onHide={this.closeModalActivate} centered>
          <Modal.Header>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
             
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="fontDefaulBold" style={{fontSize:20, textAlign:'center'}}>Are you sure to take this Submission ?</div>
          </Modal.Body>
          <Modal.Footer style={{justifyContent:'center'}}>
            <button className="btn btm-icademy-primary btn-icademy-grey buttonBack width200" onClick={this.closeModalActivate.bind(this)}>
              Back
            </button>
            <a href={`/training/exam-user/${idTrainingUser}/${this.state.selectedHistory.assignee_id}`}
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

export default DetailCoursePlan;
