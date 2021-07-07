import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';
import DataTable from 'react-data-table-component';
import { MultiSelect } from 'react-sm-select';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
        toggledClearRows: false,
        toggledClearRows2: false,
        userId: '',
        usersSelected:[],
        assigneeSelected:[],
        data: [],
        data2: [],
        filter:'',
        filter2:'',
        isLoading: false,
        isLoading2: false,
        companyId:'',
        image:'',
        logo:'',
        imagePreview:'assets/images/no-image.png',
        name: '',
        address: '',
        telephone: '',
        fax: '',
        website: '',
        email: '',
        start_date: new Date(),
        end_date: new Date(),
        edited: false,
        totalQuestion: 0,
        optionsCompany: [],
        valueCompany: [],
        valueCompany2: [],

        isSaving: false,
        id: this.props.match.params.id ? this.props.match.params.id : '',
        exam: this.props.match.params.type === 'quiz' ? 0 : 1,
        answer: '',
        question_text:'',
        title: '',
        time: 90,
        numberQuestions: 0,
        category: '',
        minScore: '',
        subCategory: '',
        optionsLicensesType: [],
        valueLicensesType: [],
        optionsCourse: [],
        valueCourse: [],
        valueCourse2: [],
        generate: false,
        scheduled: false,
        generate_membership: false,
        session_title : '',
        file: '',
        selectedQuestion: '',
        media: [],
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,
        question : [],
        composition: [
            {
                total: 0,
                course_id: []
            }
        ]
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.goBack();
    }
  }
  getCompany(id){
    API.get(`${API_SERVER}v2/training/company/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
        }
        else{
            res.data.result.map(item=>{
                this.state.optionsCompany.push({label: item.name, value: item.id})
            })
        }
    })
  }
  
  getData(id){
    API.get(`${API_SERVER}v2/training/exam/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read data')
        }
        else{
            this.setState({
                initialQuestion: res.data.result.question.length ? true : false,
                title: res.data.result.title,
                time: res.data.result.time_limit,
                minScore: res.data.result.minimum_score,
                generate: res.data.result.generate_question ? true : false,
                scheduled: res.data.result.scheduled ? true : false,
                generate_membership: res.data.result.generate_membership ? true : false,
                start_date: res.data.result.start_time ? new Date(res.data.result.start_time) : new Date(),
                end_date: res.data.result.end_time ? new Date(res.data.result.end_time) : new Date(),
                imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview,
                valueLicensesType: [Number(res.data.result.licenses_type_id)],
                valueCourse2: [Number(res.data.result.course_id)],
                selectedQuestion: res.data.result.question.length ? res.data.result.question[0].id : '',
                question: res.data.result.question
            })
            if (res.data.result.composition.length){
                let composition = res.data.result.composition;
                composition.map((item)=>{
                    item.course_id = [item.course_id]
                })
                this.setState({composition: composition})
            }
            let totalQuestion = 0;
            this.state.composition.map(item=>{
                totalQuestion = totalQuestion + item.total;
            })
            this.setState({totalQuestion: totalQuestion})
        }
    })
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id },()=>{
            API.get(`${API_SERVER}v2/training/settings/licenses-type/${this.state.companyId}`).then(res => {
                if (res.data.error){
                    toast.error(`Error read licenses type`)
                }
                else{
                    res.data.result.map((item)=>{
                        this.state.optionsLicensesType.push({label: item.name, value: item.id})
                    })
                    API.get(`${API_SERVER}v2/training/course-list-admin/${this.state.companyId}`).then(res => {
                        if (res.data.error){
                            toast.error(`Error read course list`)
                        }
                        else{
                            res.data.result.map((item)=>{
                                this.state.optionsCourse.push({label: item.title, value: item.id})
                            })
                            if (this.state.id){
                                this.getData(this.state.id);
                                this.getAssignee(this.props.match.params.id)
                                this.getCompany(this.state.companyId);
                            }
                        }
                    })
                }
            })
          });
        }
    })
  }
  getUserTrainingCompany = (id) =>{
    this.setState({toggledClearRows: true})
    if (id.length){
      this.setState({isLoading: true, valueCompany: id});
      API.get(`${API_SERVER}v2/training/user/training-company/user/${id}`).then(res => {
          if (res.data.error){
              toast.error(`Error read users`)
              this.setState({isLoading: false});
          }
          else{
              this.setState({data: res.data.result, isLoading: false, toggledClearRows: false})
          }
      })
    }
    else{
      this.setState({data: [], toggledClearRows: true})
    }
  }
  getAssignee(id){
    this.setState({isLoading2: true});
    API.get(`${API_SERVER}v2/training/assignee/exam/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read assignee`)
            this.setState({isLoading2: false});
        }
        else{
            this.setState({data2: res.data.result, isLoading2: false})
        }
    })
  }
  componentDidMount(){
    this.getUserData();
  }

  assign = (e) => {
    e.preventDefault();
    this.setState({isSaving: true});
    let items = this.state.usersSelected;
    let training_user_id = items.map(x => {
      return x.id;
    });
    let form = {
        training_company_id: this.state.valueCompany[0],
        exam_id: this.props.match.params.id,
        training_user_id: training_user_id,
        created_by: this.state.userId
    }
    API.post(`${API_SERVER}v2/training/bulk-assign`, form).then(res => {
        if (res.data.error){
            toast.error(`Error assign`)
            this.setState({isSaving: false});
        }
        else{
          if (res.data.result === 'validationError'){
            toast.error(res.data.message);
            this.setState({isSaving: false});
          }
          else{
            this.setState({toggledClearRows: true})
            this.getAssignee(this.props.match.params.id)
            toast.success(`Assignment success`);
            this.setState({isSaving: false});
          }
        }
    })
  }

  remove = (e) => {
    e.preventDefault();
    let items = this.state.assigneeSelected;
    let id = items.map(x => {
      return x.id;
    });
    let form = {
        id: id,
        created_by: this.state.userId
    }
    API.delete(`${API_SERVER}v2/training/bulk-assign`, form).then(res => {
        if (res.data.error){
            toast.error(`Error remove assignment`)
        }
        else{
          if (res.data.result === 'validationError'){
            toast.error(res.data.message);
          }
          else{
            this.setState({toggledClearRows2: true})
            this.getAssignee(this.props.match.params.id)
            toast.success(`Remove assignment success`);
          }
        }
    })
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }
  filter2 = (e) => {
    e.preventDefault();
    this.setState({ filter2: e.target.value });
  }
  onSelectUser = (e) => {
    this.setState({usersSelected: e.selectedRows, toggledClearRows: false})
  }
  onSelectAssignee = (e) => {
    this.setState({assigneeSelected: e.selectedRows, toggledClearRows2: false})
  }
  render() {
    const columns = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
    ];
    const columns2 = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Status',
        selector: 'assignment_status',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => Moment.tz(row.assignment_date, 'Asia/Jakarta').format("DD-MM-YYYY"),
        name: 'Date',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      }
    ];
    let {data, data2, filter, filter2, valueCompany, valueCompany2} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    if (filter2 != "") {
      data2 = data2.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter2, "gmi"))
      )
    }
    if (valueCompany2 != "") {
      data2 = data2.filter(x =>
        x.training_company_id === valueCompany2[0]
      )
    }
    const HeaderUser = e => {
        return (
            <div style={{width:'100%'}}>
                <h5 className="float-left" style={{lineHeight:'44px'}}>{this.state.usersSelected.length} {this.state.usersSelected.length === 1 ? 'user' : 'users'} selected</h5>
                <button
                    disabled={this.state.isSaving}
                    onClick={this.assign}
                    className="btn btn-icademy-primary float-right"
                    style={{ padding: "7px 8px !important", marginLeft: 30, marginTop:5 }}>
                    <i className="fa fa-user-plus"></i>
                    {this.state.isSaving ? 'Assigning...' : `Assign ${this.state.usersSelected.length} ${this.state.usersSelected.length === 1 ? 'User' : 'Users'}`}
                </button>
            </div>
        )
    };
    const HeaderAssignee = e => {
        return (
            <div style={{width:'100%'}}>
                <h5 className="float-left" style={{lineHeight:'44px'}}>{this.state.assigneeSelected.length} {this.state.assigneeSelected.length === 1 ? 'assignee' : 'assignees'} selected</h5>
                <button
                    disabled={this.state.isSaving}
                    onClick={this.remove}
                    className="btn btn-icademy-primary btn-icademy-red float-right"
                    style={{ padding: "7px 8px !important", marginLeft: 30, marginTop:5 }}>
                    <i className="fa fa-user-minus"></i>
                    {this.state.isSaving ? 'Removing...' : `Remove ${this.state.assigneeSelected.length} ${this.state.assigneeSelected.length === 1 ? 'Assignee' : 'Assignees'}`}
                </button>
            </div>
        )
    };
    
    const ExpandableUsers = ({data}) =>(
      <table className="expandTable">
        <tr>
          <td rowspan='7' coslpan='3'><a href={data.image} target="_blank"><img height="100px" alt={data.name} src={data.image ? data.image : 'assets/images/no-image.png'} /></a></td>
        </tr>
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>{data.name}</td>
        </tr>
        <tr>
          <td>Identity Card Number</td>
          <td>:</td>
          <td>{data.identity}</td>
        </tr>
        <tr>
          <td>License Number</td>
          <td>:</td>
          <td>{data.license_number.length ? data.license_number : '-'}</td>
        </tr>
        <tr>
          <td>Phone</td>
          <td>:</td>
          <td>{data.phone}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>:</td>
          <td>{data.email}</td>
        </tr>
        <tr>
          <td>Company</td>
          <td>:</td>
          <td>{data.company}</td>
        </tr>
      </table>
    );
    const ExpandableAssignee = ({data}) =>(
      <table className="expandTable">
        <tr>
          <td rowspan='9' coslpan='3'><a href={data.image} target="_blank"><img height="100px" alt={data.name} src={data.image ? data.image : 'assets/images/no-image.png'} /></a></td>
        </tr>
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>{data.name}</td>
        </tr>
        <tr>
          <td>Identity Card Number</td>
          <td>:</td>
          <td>{data.identity}</td>
        </tr>
        <tr>
          <td>License Number</td>
          <td>:</td>
          <td>{data.license_number.length ? data.license_number : '-'}</td>
        </tr>
        <tr>
          <td>Phone</td>
          <td>:</td>
          <td>{data.phone}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>:</td>
          <td>{data.email}</td>
        </tr>
        <tr>
          <td>Company</td>
          <td>:</td>
          <td>{data.company}</td>
        </tr>
        <tr>
          <td>Assignment Date</td>
          <td>:</td>
          <td>{Moment.tz(data.assignment_date, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm:ss")}</td>
        </tr>
        <tr>
          <td>Assignment Status</td>
          <td>:</td>
          <td>{data.assignment_status}</td>
        </tr>
      </table>
    );
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
                                        <div>
                                            <div className="card p-20">
                                                <div className="row">
                                                    <div className="col-sm-10 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.state.exam ? 'Exam' : 'Quiz'} Assignment</strong>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>{this.state.exam ? 'Exam' : 'Quiz'} Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <table className="info-exam">
                                                            <tr>
                                                                <td>Thumbnail</td>
                                                                <td>:</td>
                                                                <td><img src={this.state.imagePreview} height="54.8px" /></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Title</td>
                                                                <td>:</td>
                                                                <td>{this.state.title}</td>
                                                            </tr>
                                                        </table>
                                                        <table className="info-exam">
                                                            <tr>
                                                                <td>Time Limit</td>
                                                                <td>:</td>
                                                                <td>{this.state.time} Minutes</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Minimum Score</td>
                                                                <td>:</td>
                                                                <td>{this.state.minScore}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Generated Question</td>
                                                                <td>:</td>
                                                                <td>{this.state.generate ? 'Yes' : 'No'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Total Question</td>
                                                                <td>:</td>
                                                                <td>{this.state.generate ? this.state.totalQuestion : this.state.question.length}</td>
                                                            </tr>
                                                        </table>
                                                        <table className="info-exam">
                                                            <tr>
                                                                <td>Schedule</td>
                                                                <td>:</td>
                                                                <td>{this.state.scheduled ? Moment.tz(this.state.start_date, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss") +' - '+ Moment.tz(this.state.end_date, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss") : '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Generate Membership</td>
                                                                <td>:</td>
                                                                <td>{this.state.generate_membership ? 'Yes' : 'No'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>License Type</td>
                                                                <td>:</td>
                                                                <td>{this.state.valueLicensesType.length && this.state.optionsLicensesType.length ? this.state.optionsLicensesType.filter(x => x.value === this.state.valueLicensesType[0])[0].label : '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Assign to Course</td>
                                                                <td>:</td>
                                                                <td>{this.state.optionsCourse.length && this.state.valueCourse2.length ? this.state.optionsCourse.filter(x => x.value === this.state.valueCourse2[0]).length ? this.state.optionsCourse.filter(x => x.value === this.state.valueCourse2[0])[0].label : '-' : '-'}</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="form-section no-border field-white">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Users</strong>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Assignee</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <LoadingOverlay
                                                            active={this.state.isLoading}
                                                            spinner={<BeatLoader size='30' color='#008ae6' />}
                                                            >
                                                                <div className="float-left col-sm-6 lite-filter m-t-10" style={{paddingLeft:0}}>
                                                                    <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={valueCompany => this.getUserTrainingCompany(valueCompany)} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Choose Company" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search"
                                                                    onChange={this.filter}
                                                                    className="form-control float-left col-sm-6 m-t-10"/>
                                                                <DataTable
                                                                columns={columns}
                                                                data={data}
                                                                highlightOnHover
                                                                pagination
                                                                fixedHeader
                                                                selectableRows
                                                                selectableRowsHighlight
                                                                expandableRows
                                                                expandableRowsComponent={<ExpandableUsers />}
                                                                clearSelectedRows={this.state.toggledClearRows}
                                                                noDataComponent={this.state.valueCompany != "" ? 'There are no users to display.' : <div><img src='newasset/left-top-row-blue.png' style={{width:'20%', height:80, position:'absolute', top:0, left:'10%'}}></img><p style={{marginTop:70, textAlign:'center'}}>Please choose company first.</p></div>}
                                                                paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
                                                                contextComponent={<HeaderUser />}
                                                                onSelectedRowsChange={this.onSelectUser}
                                                                />
                                                            </LoadingOverlay>
                                                        </div>
                                                        <div className="col-sm-6" style={{borderLeft:'1px solid #e2e2e2'}}>
                                                            <LoadingOverlay
                                                            active={this.state.isLoading2}
                                                            spinner={<BeatLoader size='30' color='#008ae6' />}
                                                            >
                                                                <div className="float-left col-sm-6 lite-filter m-t-10" style={{paddingLeft:0}}>
                                                                    <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany2} onChange={valueCompany2 => this.setState({ valueCompany2 })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Filter Company" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search"
                                                                    onChange={this.filter2}
                                                                    className="form-control float-left col-sm-6 m-t-10"/>
                                                                <DataTable
                                                                columns={columns2}
                                                                data={data2}
                                                                highlightOnHover
                                                                pagination
                                                                fixedHeader
                                                                selectableRows
                                                                selectableRowsHighlight
                                                                expandableRows
                                                                expandableRowsComponent={<ExpandableAssignee />}
                                                                clearSelectedRows={this.state.toggledClearRows2}
                                                                paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
                                                                noDataComponent='There are no assigned user, please select users and assign.'
                                                                contextComponent={<HeaderAssignee />}
                                                                onSelectedRowsChange={this.onSelectAssignee}
                                                                />
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
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default Assignment;
