import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import TabMenuPlan from '../../tab_menu/route_plan';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal } from 'react-bootstrap';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { MultiSelect } from 'react-sm-select';
import DatePicker from "react-datepicker";
import { ProgressBar } from 'react-bootstrap';

class UserProgressionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: '',
        name: '',
        email: '',
        identity: '',
        license_number: '',
        training_company_name: '',
        progress: 0,
      companyId: '',
      data : [],
      unassigned : [],
      filter:'',
      modalDelete: false,
      deleteId: '',
      modalActivate: false,
      activateId: '',
      dataState: false,
      isLoading: false,
      optionsCourse: [],
      optionsScheduled: [{label: 'Yes', value: '1'}, {label: 'No', value: '0'}],
      start_time: new Date(),
      end_time: new Date()
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }
  closeModalActivate = e => {
    this.setState({ modalActivate: false, activateId: '' })
  }

  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }
  onClickActivate(id){
    this.setState({modalActivate: true, activateId: id})
  }

  delete (id){
    API.delete(`${API_SERVER}v2/training/course/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete course')
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.success('Course deleted');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getCourseList(trainingUserId){
    this.setState({isLoading: true, dataState:true});
    API.get(`${API_SERVER}v2/training/plan-user/${trainingUserId}`).then(res => {
        if (res.data.error){
            toast.error('Error read course list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result.data, unassigned: res.data.result.unassigned, progress: res.data.result.progress, isLoading: false})
            res.data.result.data.map((item)=>{
                this.state.optionsCourse.push({label: item.title, value: item.id})
            })
        }
    })
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getCourseList(this.props.match.params.id);
          this.getUserDetail(this.props.match.params.id);
        }
    })
  }

  getUserDetail(id){
    API.get(`${API_SERVER}v2/training/user/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read user')
        }
        else{
            this.setState({
                id: res.data.result.id,
                name: res.data.result.name,
                email: res.data.result.email,
                identity: res.data.result.identity,
                license_number: res.data.result.license_number,
                training_company_name: res.data.result.training_company_name
            })
        }
    })
  }
  componentDidMount(){
    this.getUserData()
  }

  render() {
    let {filter, data, unassigned} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
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
                                        <TabMenu title='Training' selected='Plan'/>
                                        <TabMenuPlan title='' selected={`User's Progression`}/>
                                        <div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                  <div className="col-sm-12 m-b-20">
                                                    <table style={{float:'left'}}>
                                                        <tr>
                                                            <td>Name</td>
                                                            <td>:</td>
                                                            <td>{this.state.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Company</td>
                                                            <td>:</td>
                                                            <td>{this.state.training_company_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Email</td>
                                                            <td>:</td>
                                                            <td>{this.state.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Identity</td>
                                                            <td>:</td>
                                                            <td>{this.state.identity}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>License Number</td>
                                                            <td>:</td>
                                                            <td>{this.state.license_number}</td>
                                                        </tr>
                                                    </table>
                                                    <div className="progressBarDetailUser">
                                                      <ProgressBar now={this.state.progress} label={`Total : ${this.state.progress}%`} />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20" style={{overflowX:'scroll'}}>
                                                        <table className="table-plan">
                                                            <tr>
                                                                <th style={{minWidth:'120px'}}>Type</th>
                                                                <th>Name</th>
                                                                <th>Duration</th>
                                                                <th>Require</th>
                                                                <th>Course</th>
                                                                <th>Scheduled</th>
                                                                <th>Schedule Start</th>
                                                                <th>Schedule End</th>
                                                                <th>Progression</th>
                                                            </tr>
                                                            {
                                                              data.length ?
                                                                data.map((item, index)=>{
                                                                return(
                                                                <>
                                                                <tr className="table-plan-course">
                                                                    <td><span class={`badge badge-pill badge-${item.type === 'Course' ? 'primary' : 'secondary'}`}>{item.type}</span></td>
                                                                    <td style={{fontWeight:'bold'}}>{item.title}</td>
                                                                    <td>{item.duration}</td>
                                                                    <td>
                                                                      {
                                                                        item.edit ?
                                                                          <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[Number(item.require_course_id)]} onChange={valueCourse => {item.require_course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                        :
                                                                          item.require_course_title ? item.require_course_title : '-'
                                                                      } 
                                                                    </td>
                                                                    <td>-</td>
                                                                    <td>
                                                                      {
                                                                        item.edit ?
                                                                          <MultiSelect id="valueScheduled" options={this.state.optionsScheduled} value={[String(item.scheduled)]} onChange={(valueScheduled) => {item.scheduled = String(valueScheduled); this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Option" />
                                                                        :
                                                                          item.scheduled ? 'Yes' : '-'
                                                                      } 
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        item.edit ?
                                                                          String(item.scheduled) === '1' ?
                                                                            <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={item.start_time ? new Date(item.start_time) : new Date()} onChange={e => {item.start_time = e; this.forceUpdate()}} />
                                                                          : null
                                                                        :
                                                                          String(item.scheduled) === '1' ? moment(item.start_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                      } 
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        item.edit ?
                                                                          String(item.scheduled) === '1' ?
                                                                            <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={item.end_time ? new Date(item.end_time) : new Date()} onChange={e => {item.end_time = e; this.forceUpdate()}} />
                                                                          : null
                                                                        :
                                                                          String(item.scheduled) === '1' ? moment(item.end_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                      } 
                                                                    </td>
                                                                    <td>
                                                                      <div className="progressBar">
                                                                          <ProgressBar now={item.progress} label={`${item.progress}%`} />
                                                                      </div>
                                                                    </td>
                                                                </tr>
                                                                {
                                                                    item.session ? item.session.map((row)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-secondary`}>{row.type}</span></td>
                                                                            <td>{row.title}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>
                                                                              {row.is_read ? <i className="fa fa-check" style={{color:'#109810', fontSize:'11px'}}></i> : <i className="fa fa-hourglass-half" style={{color:'#dc3545', fontSize:'11px'}}></i>}
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.liveclass ? item.liveclass.map((row, i)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-success`}>{row.type}</span></td>
                                                                            <td>{row.judul}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[Number(row.training_course_id)]} onChange={valueCourse => {row.training_course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                                :
                                                                                  item.title
                                                                              } 
                                                                            </td>
                                                                            <td>{row.start_time && row.end_time ? 'Yes' : 'Not yet'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.start_time ? new Date(row.start_time) : new Date()} onChange={e => {row.start_time = e; this.forceUpdate()}} />
                                                                                :
                                                                                  row.start_time ? moment(row.start_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.end_time ? new Date(row.end_time) : new Date()} onChange={e => {row.end_time = e; this.forceUpdate()}} />
                                                                                :
                                                                                  row.end_time ? moment(row.end_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {row.is_read ? <i className="fa fa-check" style={{color:'#109810', fontSize:'11px'}}></i> : <i className="fa fa-hourglass-half" style={{color:'#dc3545', fontSize:'11px'}}></i>}
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.quiz ? item.quiz.map((row, i)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-warning`}>{row.type}</span></td>
                                                                            <td>{row.title}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[Number(row.course_id)]} onChange={valueCourse => {row.course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                                :
                                                                                  item.title
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueScheduled" options={this.state.optionsScheduled} value={[String(row.scheduled)]} onChange={(valueScheduled) => {row.scheduled = String(valueScheduled); this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Option" />
                                                                                :
                                                                                  row.scheduled ? 'Yes' : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  String(row.scheduled) === '1' ?
                                                                                    <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.start_time ? new Date(row.start_time) : new Date()} onChange={e => {row.start_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.start_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                String(row.scheduled) === '1' ?
                                                                                  <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.end_time ? new Date(row.end_time) : new Date()} onChange={e => {row.end_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.end_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {row.is_read ? <i className="fa fa-check" style={{color:'#109810', fontSize:'11px'}}></i> : <i className="fa fa-hourglass-half" style={{color:'#dc3545', fontSize:'11px'}}></i>}&nbsp;
                                                                              {row.score && row.score.length ? `Score : ${row.score}` : ''}
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.exam ? item.exam.map((row, i)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-danger`}>{row.type}</span></td>
                                                                            <td>{row.title}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[Number(row.course_id)]} onChange={valueCourse => {row.course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                                :
                                                                                  item.title
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueScheduled" options={this.state.optionsScheduled} value={[String(row.scheduled)]} onChange={(valueScheduled) => {row.scheduled = String(valueScheduled); this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Option" />
                                                                                :
                                                                                  row.scheduled ? 'Yes' : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  String(row.scheduled) === '1' ?
                                                                                    <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.start_time ? new Date(row.start_time) : new Date()} onChange={e => {row.start_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.start_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                String(row.scheduled) === '1' ?
                                                                                  <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.end_time ? new Date(row.end_time) : new Date()} onChange={e => {row.end_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.end_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {row.is_read ? <i className="fa fa-check" style={{color:'#109810', fontSize:'11px'}}></i> : <i className="fa fa-hourglass-half" style={{color:'#dc3545', fontSize:'11px'}}></i>}&nbsp;
                                                                              {row.score && row.score.length ? `Score : ${row.score}` : ''}
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                </>
                                                                )
                                                                })
                                                                :
                                                                <tr>
                                                                  <td colspan='8'>No course</td>
                                                                </tr>
                                                            }
                                                            <tr>
                                                                <th colspan='8' style={{paddingTop:'20px', paddingBottom:'20px'}}>Unassigned Quiz & Exam</th>
                                                            </tr>
                                                            {
                                                              unassigned.length ?
                                                                unassigned.map((row, i)=>{
                                                                  var m = row.time_limit % 60;
                                                                  var h = (row.time_limit-m)/60;
                                                                  var duration = (h<10?"0":"") + h.toString() + ":" + (m<10?"0":"") + m.toString();
                                                                return(
                                                                    <tr>
                                                                        <td><span class={`badge badge-pill badge-${row.type === 'Quiz' ? 'warning' : 'danger'}`}>{row.type}</span></td>
                                                                        <td>{row.title}</td>
                                                                        <td>{duration}</td>
                                                                        <td>-</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[row.course_id]} onChange={valueCourse => {row.course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                                :
                                                                                  '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueScheduled" options={this.state.optionsScheduled} value={[String(row.scheduled)]} onChange={(valueScheduled) => {row.scheduled = String(valueScheduled); this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Option" />
                                                                                :
                                                                                  row.scheduled ? 'Yes' : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  String(row.scheduled) === '1' ?
                                                                                    <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.start_time ? new Date(row.start_time) : new Date()} onChange={e => {row.start_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.start_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                String(row.scheduled) === '1' ?
                                                                                  <DatePicker showTimeSelect dateFormat="dd-MM-yyyy HH:mm" selected={row.end_time ? new Date(row.end_time) : new Date()} onChange={e => {row.end_time = e; this.forceUpdate()}} />
                                                                                  : null
                                                                                :
                                                                                  String(row.scheduled) === '1' ? moment(row.end_time).local().format('DD-MM-YYYY HH:mm') : '-'
                                                                              } 
                                                                            </td>
                                                                            <td>
                                                                              {row.is_read ? <i className="fa fa-check" style={{color:'#109810', fontSize:'11px'}}></i> : <i className="fa fa-hourglass-half" style={{color:'#dc3545', fontSize:'11px'}}></i>}
                                                                            </td>
                                                                    </tr>
                                                                )
                                                                })
                                                              :
                                                              <tr>
                                                                <td colspan='8'>No unassigned quiz & exam</td>
                                                              </tr>
                                                            }
                                                        </table>
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

export default UserProgressionDetail;
