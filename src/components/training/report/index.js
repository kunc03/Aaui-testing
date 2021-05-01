import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from "react-toastify";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Link } from "react-router-dom";
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DatePicker from "react-datepicker";
import { MultiSelect } from 'react-sm-select';
import Moment from 'moment-timezone';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      filter:'',
      file:'',
      deleteId: '',
      isUploading: false,

      start: new Date(new Date().setMonth(new Date().getMonth()-1)),
      end: new Date(),
      optionsCompany: [],
      valueCompany: [],
      optionsLicensesType: [],
      valueLicensesType: [],
      user: ''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  handleChangeFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  handleChange = (name, e) => {
    this.setState({[name]: e}, () => {
        this.getList();
    })
  }

  getList(){
    let form = {
        start: this.state.start,
        end: this.state.end,
        licenses_type: this.state.valueLicensesType,
        company: this.state.companyId,
        training_company: this.state.valueCompany
    }
    API.post(`${API_SERVER}v2/training/report`, form).then(res => {
        if (res.data.error){
            toast.error('Error read company list')
        }
        else{
            this.setState({data: res.data.result})
        }
    })
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

  getLicenses(){
    API.get(`${API_SERVER}v2/training/settings/licenses-type/${this.state.companyId}`).then(res => {
        if (res.data.error){
            toast.error(`Error read course list`)
        }
        else{
            res.data.result.map((item)=>{
                this.state.optionsLicensesType.push({label: item.name, value: item.id})
            })
        }
    })
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getCompany(this.state.companyId);
          this.getLicenses();
          if (res.data.result.level === 'client'){
            API.get(`${API_SERVER}v2/training/user/read/user/${res.data.result.user_id}`).then(res => {
                if (res.data.error){
                    toast.error(`Error read training user data`)
                }
                else{
                    this.setState({valueCompany: [res.data.result.training_company_id]}, () => {
                        this.getList();
                    })
                }
            })
          }
          else{
            this.getList();
          }
        }
    })
  }

  componentDidMount(){
    this.getUserData()
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
    const Table = ({ items }) => (
      <div className="wrap col-sm-12" style={{ marginTop: 40, maxHeight: 500, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
        <table id="table-data" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Type</th>
              <th>License Type</th>
              <th>Title</th>
              <th>Course</th>
              <th>Submission</th>
              <th>Work Time (Minute)</th>
              <th>Minimum Score</th>
              <th>Score</th>
              <th>Pass</th>
              <th>License Number</th>
            </tr>
          </thead>
          <tbody>
            {
            items.length ?
              items.map((item, i) => {
                return (<tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.training_company}</td>
                  <td>{item.licenses_type}</td>
                  <td>{item.exam_type}</td>
                  <td>{item.exam_name}</td>
                  <td>{item.course_name}</td>
                  <td>{Moment.tz(item.submission_time, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}</td>
                  <td>{item.work_time}</td>
                  <td>{item.minimum_score}</td>
                  <td>{item.score}</td>
                  <td>{item.pass ? 'Yes' : 'No'}</td>
                  <td>{item.license_number}</td>
                </tr>)
              })
              :
              <tr><td colspan='13'>No Data</td></tr>
            }
          </tbody>
        </table>
      </div>
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
                                        <TabMenu title='Training' selected='Report'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Filter</strong>
                                                        <div className="form-section no-border">
                                                            <div className="row">
                                                                <div className="form-field-top-label">
                                                                    <label for="start">Start Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.start} onChange={e => this.handleChange('start', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="end">End Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.end} onChange={e => this.handleChange('end', e)} />
                                                                </div>
                                                                <div className="form-field-top-label" style={{width:300}}>
                                                                    <label for="course">License Type</label>
                                                                    <MultiSelect id="course" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={e => this.handleChange('valueLicensesType', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                </div>
                                                                {
                                                                    Storage.get('user').data.level !== 'client' ?
                                                                    <div className="form-field-top-label" style={{width:300}}>
                                                                        <label for="company">Company</label>
                                                                        <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={e => this.handleChange('valueCompany', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Company" />
                                                                    </div>
                                                                    : null
                                                                }
                                                                <div className="form-field-top-label">
                                                                    <label for="filter">Search</label>  
                                                                    <input type="text" placeholder="Search" onChange={this.filter}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Data</strong>
                                                        <ReactHTMLTableToExcel
                                                            className="btn btn-icademy-warning btn-12 float-right col-sm-3"
                                                            table="table-data"
                                                            filename={'Training Report'}
                                                            sheet="Sheet 1"
                                                            buttonText="Export to Excel" />
                                                        <Table items={data} />
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

export default Report;
