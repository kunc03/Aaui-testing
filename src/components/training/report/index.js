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
import { Modal, Button, Form, Badge } from 'react-bootstrap';

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
      optionsPass: [{label: 'Yes', value: '1'},{label: 'No', value: '0'}],
      valuePass: [],
      user: '',
      checkAll: false,
      isModalSertifikat: false,
      sertifikat: [],
      companyLogo: '',
      cert_logo: '',
      cert_title: 'CERTIFICATE OF COMPLETION',
      cert_subtitle: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO',
      cert_description: 'FOR SUCCESSFULLY COMPLETING ALL CONTENTS ON',
      cert_sign_name: ''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  fetchCompanyInfo() {
    API.get(`${API_SERVER}v1/company/${this.state.companyId}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ companyLogo: res.data.result.logo })
    })
  }

  modalSertifikat() {
    if (this.state.data.filter((item) => item.checked === true).length > 0) {
      this.fetchCompanyInfo();
      this.setState({ isModalSertifikat: true });
    }
    else {
      toast.warning('Please select the data first')
    }
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

  sertifikat = () => {
    if (this.state.cert_sign_name === '' || (this.state.signature === '' || this.state.signature === null)) {
      toast.warning('Signature name and signature image is mandatory')
    }
    else {
      let items = this.state.data;
      let sertifikat = items.filter(e => { return e.checked }).map(e => {
        return {
          result_id: e.id,
          company_id: this.state.companyId,
          nama: e.name,
          email: e.email,
          cert_topic: e.course_name ? e.exam_name + ' - ' + e.course_name : e.exam_name
        }
      });

      let formData = new FormData();
      formData.append('company_id', this.state.companyId);
      formData.append('cert_title', this.state.cert_title);
      formData.append('cert_subtitle', this.state.cert_subtitle);
      formData.append('cert_description', this.state.cert_description);
      formData.append('cert_logo', this.state.cert_logo);
      formData.append('signature', this.state.signature);
      formData.append('cert_sign_name', this.state.cert_sign_name);
      formData.append('data', JSON.stringify(sertifikat));

      API.post(`${API_SERVER}v2/training/certificate`, formData).then(async (res) => {
        toast.success(`Sending certificate to participant's email`);
        this.handleModal();
        this.getList();
      });
    }
  }

  handleModal = () => {
    this.setState({
      isModalSertifikat: false
    });
  }

  handleChangeFilter = (name, e) => {
    this.setState({[name]: e}, () => {
        this.getList();
    })
  }
  handleChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size <= 5000000) {
        this.setState({
          [e.target.id]: e.target.files[0],
          [`${e.target.id}_img`]: URL.createObjectURL(e.target.files[0]),
        });
      } else {
        e.target.value = null;
        toast.warning('Maximum file is 5MB')
      }
    }
  };
  handleChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      let a = this.state;
      this.setState(a);
    });
  };

  handleChangeChecked(e, item) {
    item['checked'] = e.target.checked;
  }
  checkAll(e) {
    let item = this.state.data;
    let filter = this.state.filter;
    if (filter != "") {
      item = item.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    item.map((item, index) => {
      item.checked = e.target.checked;
    })
    this.setState({ item, checkAll: e.target.checked })
  }

  getList(){
    let form = {
        start: this.state.start,
        end: this.state.end,
        licenses_type: this.state.valueLicensesType,
        company: this.state.companyId,
        training_company: this.state.valueCompany,
        pass: this.state.valuePass
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
      <div>
      <div className="wrap col-sm-12" style={{ marginTop: 40, maxHeight: 500, overflowY: 'scroll', overflowX: 'scroll', paddingRight: 10 }}>
        <table id="table-data" className="table table-striped">
          <thead>
            <tr>
              { Storage.get('user').data.level !== 'client' ? <th><input type="checkbox" checked={this.state.checkAll} onChange={(e) => this.checkAll(e)} /></th> : null }
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>License Type</th>
              <th>Type</th>
              <th>Title</th>
              <th>Course</th>
              <th>Submission</th>
              <th>Work Time (Minute)</th>
              <th>Minimum Score</th>
              <th>Score</th>
              <th>Pass</th>
              <th>License Number</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {
            items.length ?
              items.map((item, i) => {
                return (<tr key={i}>
                  { Storage.get('user').data.level !== 'client' ? <td><input type="checkbox" id={i} checked={items[i].checked} onChange={(e) => this.handleChangeChecked(e, item)} /></td> : null }
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
                  <td>
                    {
                    item.certificate_status === null ? '-' :
                    item.certificate_status === 'Sent' ? <a href={item.certificate} target="_blank"><Badge variant="primary">View</Badge></a> :
                    item.certificate_status === 'Processing' ? <Badge variant="warning">{item.certificate_status}</Badge> :
                    <Badge variant="danger">{item.certificate_status}</Badge>
                    }
                  </td>
                </tr>)
              })
              :
              <tr><td colspan='15'>No Data</td></tr>
            }
          </tbody>
        </table>
      </div>
      { Storage.get('user').data.level !== 'client' ? <Button className="btn btn-icademy-primary btn-12" onClick={this.modalSertifikat.bind(this)}>Create Certificate</Button> : null }
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
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.start} onChange={e => this.handleChangeFilter('start', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="end">End Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.end} onChange={e => this.handleChangeFilter('end', e)} />
                                                                </div>
                                                                <div className="form-field-top-label" style={{width:300}}>
                                                                    <label for="course">License Type</label>
                                                                    <MultiSelect id="course" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={e => this.handleChangeFilter('valueLicensesType', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select License Type" />
                                                                </div>
                                                                {
                                                                    Storage.get('user').data.level !== 'client' ?
                                                                    <div className="form-field-top-label" style={{width:300}}>
                                                                        <label for="company">Company</label>
                                                                        <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={e => this.handleChangeFilter('valueCompany', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Company" />
                                                                    </div>
                                                                    : null
                                                                }
                                                                <div className="form-field-top-label" style={{width:300}}>
                                                                    <label for="pass">Pass</label>
                                                                    <MultiSelect id="pass" options={this.state.optionsPass} value={this.state.valuePass} onChange={e => this.handleChangeFilter('valuePass', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Pass" />
                                                                </div>
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
          <Modal
            show={this.state.isModalSertifikat}
            onHide={this.handleModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Create Certificate
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <div style={{ width: '750px', padding: '10px', textAlign: 'center', border: '3px solid #787878', fontSize: '25px' }}>
                    <div style={{ width: '724px', padding: '10px', textAlign: 'center', border: '1px solid #787878' }}><br />

                      <label for='cert_logo' style={{ display: 'block' }}>
                        <img style={{ height: '50px', cursor: 'pointer' }} src={this.state.cert_logo == '' || this.state.cert_logo == null ? this.state.companyLogo : typeof this.state.cert_logo === 'object' && this.state.cert_logo !== null ? URL.createObjectURL(this.state.cert_logo) : this.state.cert_logo} />
                      </label>
                      <input type="file" style={{ display: 'none', cursor: 'pointer' }} id="cert_logo" name="cert_logo" onChange={this.handleChange} className="ml-5 btn btn-sm btn-default" />
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        <input type='text' name='cert_title' onChange={this.handleChangeText} style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center', fontWeight: 'bold' }} value={this.state.cert_title} />
                      </span>
                      <br /><br />
                      <span style={{ fontSize: '15px' }}>
                        <input type='text' onChange={this.handleChangeText} name='cert_subtitle' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} value={this.state.cert_subtitle} />
                      </span>
                      <br /><br />
                      <span style={{ fontSize: '20px' }}><b>[Name]</b></span><br /><br />
                      <span style={{ fontSize: '15px' }}>
                        <input type='text' onChange={this.handleChangeText} name='cert_description' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} value={this.state.cert_description} />
                      </span> <br /><br />
                      <span style={{ fontSize: '18px' }}><b>[Exam - Course Topic]</b></span> <br /><br />
                      <span style={{ fontSize: '10px' }}>{this.state.tanggal}</span><br />
                      <label for='signature' style={{ display: 'block', cursor: 'pointer' }}>
                        <img style={{ height: '80px' }} src={this.state.signature == '' || this.state.signature == null ? `/newasset/imginput.png` : typeof this.state.signature === 'object' && this.state.signature !== null ? URL.createObjectURL(this.state.signature) : this.state.signature} />
                      </label>
                      <input type="file" style={{ display: 'none', cursor: 'pointer' }} id="signature" name="signature" onChange={this.handleChange} className="ml-5 btn btn-sm btn-default" />
                      <span style={{ fontSize: '12px' }}>
                        <input type='text' onChange={this.handleChangeText} name='cert_sign_name' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} placeholder='Nama Tanda Tangan' value={this.state.cert_sign_name} />
                      </span>
                    </div>
                  </div>
                </Form.Group>
              </Form>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-icademy-primary" onClick={() => this.sertifikat()}>
                Send Certificate to Participant's Email
          </Button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default Report;
