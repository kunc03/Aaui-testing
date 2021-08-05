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
import { MultiSelect } from 'react-sm-select';
import DatePicker from "react-datepicker";

class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  activate (id){
    API.put(`${API_SERVER}v2/training/course-activate/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error activate course')
        }
        else{
          this.closeModalActivate();
          this.getCourseListArchived(this.state.companyId);
          toast.success('Course activated');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getCourseListArchived(companyId){
    this.setState({isLoading: true, dataState:false});
    API.get(`${API_SERVER}v2/training/course-list-admin-archived/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read course list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  getCourseList(companyId){
    this.setState({isLoading: true, dataState:true});
    API.get(`${API_SERVER}v2/training/plan/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read course list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result.data, unassigned: res.data.result.unassigned, isLoading: false})
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
          this.getCourseList(this.state.companyId);
        }
    })
  }

  componentDidMount(){
    this.getUserData()
  }

  render() {
    let {filter, data, unassigned} = this.state;
    let data2 = [
        {
            type: 'Course',
            name : 'RD 001 Mengenal Dunia Reksa Dana',
            scheduled: 1,
            start_time: '2021-07-27T06:09:12.000Z',
            end_time: '2021-07-27T06:12:15.000Z',
            require: '',
            time: 360,
            session: [
                {
                    type: 'Session',
                    name: 'Apa Itu Reksa Dana?',
                    time: 60
                },
                {
                    type: 'Session',
                    name: 'Apa itu Manajer Investasi dan apa bedanya dengan broker?',
                    time: 60
                },
                {
                    type: 'Session',
                    name: 'Berapa Jumlah investasi yang diperlukan untuk reksa dana?',
                    time: 60
                }
            ],
            quiz: [
                {
                    type: 'Quiz',
                    name: 'RD 001 Mengenal Dunia Reksa Dana',
                    scheduled: 0,
                    start_time: null,
                    end_time: null,
                    work_time: 90,
                    require_read_session: 1
                }
            ],
            exam: [
                {
                    type: 'Exam',
                    name: 'RD 001 Mengenal Dunia Reksa Dana',
                    scheduled: 0,
                    start_time: null,
                    end_time: null,
                    work_time: 90,
                    require_read_session: 1
                }
            ],
            liveclass: [
                {
                    type: 'Live Class',
                    name: 'Webinar Mengenal Dunia Reksa Dana',
                    scheduled: 1,
                    start_time: '2021-07-27T06:09:12.000Z',
                    end_time: '2021-07-27T06:09:12.000Z',
                    duration: 90,
                    require_read_session: 1
                }
            ]
        },
        {
            type: 'Course',
            name : 'RD 002 Transaksi Reksa Dana',
            scheduled: 1,
            start_time: '2021-07-27T06:09:12.000Z',
            end_time: '2021-07-27T06:12:15.000Z',
            require: 'RD 001 Mengenal Dunia Reksa Dana',
            time: 225,
            session: [
                {
                    type: 'Session',
                    name: ' Apa dan Bagaimana mengisi formulir transaksi reksa dana?',
                    time: 15
                },
                {
                    type: 'Session',
                    name: 'Bagaimana proses jual beli reksa dana yang aman dan benar?',
                    time: 15
                },
                {
                    type: 'Session',
                    name: 'Bagaimana cara menghitung biaya dan keuntungan di Reksa Dana?',
                    time: 15
                }
            ],
            quiz: [
                {
                    type: 'Quiz',
                    name: 'Quiz6: RD 006 Strategi Investasi Reksa Dana',
                    scheduled: 0,
                    start_time: null,
                    end_time: null,
                    work_time: 90,
                    require_read_session: 1
                }
            ],
            exam: [
                {
                    type: 'Exam',
                    name: 'Final Test: Investasi Reksa Dana',
                    scheduled: 0,
                    start_time: null,
                    end_time: null,
                    work_time: 90,
                    require_read_session: 1
                }
            ]
        }
    ]
    let dataExamOpen = [
        {
            type: 'Quiz',
            name: 'Quiz Bebas Reksadana',
            scheduled: 0,
            start_time: null,
            end_time: null,
            work_time: 90
        },
        {
            type: 'Quiz',
            name: 'Quiz Bebas Reksadana Terwaktu',
            scheduled: 1,
            start_time: '2021-07-27T06:09:12.000Z',
            end_time: '2021-07-27T06:09:12.000Z',
            work_time: 90
        },
        {
            type: 'Exam',
            name: 'Exam Latihan Bebas',
            scheduled: 0,
            start_time: null,
            end_time: null,
            work_time: 90
        }
    ]
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
                                        <div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20" style={{overflowX:'scroll'}}>
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Training Plan</strong>
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
                                                                <th></th>
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
                                                                          <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[item.require_course_id]} onChange={valueCourse => {item.require_course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
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
                                                                      {new Date(item.start_time) <= new Date() && new Date(item.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}
                                                                      {
                                                                        item.edit ?
                                                                          <i className="fa fa-times" style={{cursor:'pointer', float:'right'}} onClick={()=> {item.edit = false; this.setState({valueCourse: []}); this.forceUpdate()}}></i>
                                                                        :
                                                                          <i className="fa fa-edit" style={{cursor:'pointer', float:'right'}} onClick={()=> {item.edit = true; this.forceUpdate()}}></i>
                                                                      }
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
                                                                            <td>{new Date(row.start_time) <= new Date() && new Date(row.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}</td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.liveclass ? item.liveclass.map((row)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-success`}>{row.type}</span></td>
                                                                            <td>{row.judul}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[row.training_course_id]} onChange={valueCourse => {row.training_course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
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
                                                                              {new Date(row.start_time) <= new Date() && new Date(row.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}
                                                                              {
                                                                                row.edit ?
                                                                                  <i className="fa fa-times" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = false; this.setState({valueCourse: []}); this.forceUpdate()}}></i>
                                                                                :
                                                                                  <i className="fa fa-edit" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = true; this.forceUpdate()}}></i>
                                                                              }
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.quiz ? item.quiz.map((row)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-warning`}>{row.type}</span></td>
                                                                            <td>{row.title}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[row.course_id]} onChange={valueCourse => {row.course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
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
                                                                              {new Date(row.start_time) <= new Date() && new Date(row.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}
                                                                              {
                                                                                row.edit ?
                                                                                  <i className="fa fa-times" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = false; this.setState({valueCourse: []}); this.forceUpdate()}}></i>
                                                                                :
                                                                                  <i className="fa fa-edit" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = true; this.forceUpdate()}}></i>
                                                                              }
                                                                            </td>
                                                                        </tr>
                                                                      )
                                                                    }
                                                                    ) : null
                                                                }
                                                                {
                                                                    item.exam ? item.exam.map((row)=>{
                                                                      return(
                                                                        <tr>
                                                                            <td align="center"><span class={`badge badge-pill badge-danger`}>{row.type}</span></td>
                                                                            <td>{row.title}</td>
                                                                            <td>{row.duration}</td>
                                                                            <td>{row.require_read_session ? 'Read all sessions' : '-'}</td>
                                                                            <td>
                                                                              {
                                                                                row.edit ?
                                                                                  <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={[row.course_id]} onChange={valueCourse => {row.course_id = valueCourse; this.forceUpdate()}} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
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
                                                                              {new Date(row.start_time) <= new Date() && new Date(row.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}
                                                                              {
                                                                                row.edit ?
                                                                                  <i className="fa fa-times" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = false; this.setState({valueCourse: []}); this.forceUpdate()}}></i>
                                                                                :
                                                                                  <i className="fa fa-edit" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = true; this.forceUpdate()}}></i>
                                                                              }
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
                                                                unassigned.map((row)=>{
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
                                                                              {new Date(row.start_time) <= new Date() && new Date(row.end_time) >= new Date() ? <span class={`badge badge-pill badge-success`}>On Schedule</span> : ''}
                                                                              {
                                                                                row.edit ?
                                                                                  <i className="fa fa-times" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = false; this.setState({valueCourse: []}); this.forceUpdate()}}></i>
                                                                                :
                                                                                  <i className="fa fa-edit" style={{cursor:'pointer', float:'right'}} onClick={()=> {row.edit = true; this.forceUpdate()}}></i>
                                                                              }
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
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this course ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.deleteId)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalActivate} onHide={this.closeModalActivate} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to activate this course ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalActivate.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.activate.bind(this, this.state.activateId)}>
                <i className="fa fa-trash"></i> Activate
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default Plan;
