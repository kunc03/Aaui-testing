import React, { Component } from "react";
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from "react-toastify";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DatePicker from "react-datepicker";
import { MultiSelect } from 'react-sm-select';
import Moment from 'moment-timezone';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      dataSelected : [],
      filter:'',
      file:'',
      deleteId: '',
      isUploading: false,
      isLoading: false,

      start: new Date(new Date().setMonth(new Date().getMonth()-1)),
      end: new Date(),
      optionsCompany: [],
      valueCompany: [],
      optionsLicensesType: [],
      valueLicensesType: [],
      optionsPass: [{label: 'Yes', value: '1'},{label: 'No', value: '0'}],
      valuePass: [],
      optionsCert: [{label: 'No', value: 'No'},{label: 'Sent', value: 'Sent'},{label: 'Failed', value: 'Failed'}],
      valueCert: [],
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
    if (this.state.dataSelected.length > 0) {
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
      let items = this.state.dataSelected;
      let sertifikat = items.map(e => {
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
  onSelectDataTable = (e) => {
    this.setState({dataSelected: e.selectedRows})
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
    this.setState({isLoading: true})
    let form = {
        start: this.state.start,
        end: this.state.end,
        licenses_type: this.state.valueLicensesType,
        company: this.state.companyId,
        training_company: this.state.valueCompany,
        pass: this.state.valuePass,
        cert: this.state.valueCert
    }
    API.post(`${API_SERVER}v2/training/report`, form).then(res => {
        if (res.data.error){
            toast.error('Error read company list')
            this.setState({isLoading: false})
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
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
    const columns = [
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
      {
        name: 'Training Company',
        selector: 'training_company',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'License Type',
        selector: 'licenses_type',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Exam/Quiz',
        selector: 'exam_type',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Exam Name',
        selector: 'exam_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Course',
        selector: 'course_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => Moment.tz(row.submission_time, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
        name: 'Submission Time',
        selector: 'submission_time',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Work Time (Minute)',
        selector: 'work_time',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Min Score',
        selector: 'minimum_score',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Score',
        selector: 'score',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => row.pass ? 'Yes' : 'No',
        name: 'Pass',
        selector: 'pass',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'License Number',
        selector: 'license_number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => row.certificate_status === null ? '-' :
        row.certificate_status === 'Sent' ? <a href={row.certificate} target="_blank"><Badge variant="primary">View</Badge></a> :
        row.certificate_status === 'Processing' ? <Badge variant="warning">{row.certificate_status}</Badge> :
        <Badge variant="danger">{row.certificate_status}</Badge>,
        name: 'Certificate',
        selector: 'certificate_status',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      }
    ];
    const ExpanableComponent = ({data}) =>(
      <table className="expandTable">
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>{data.name}</td>
          <td>Exam</td>
          <td>:</td>
          <td>{data.exam_name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>:</td>
          <td>{data.email}</td>
          <td>Work Time (Minute)</td>
          <td>:</td>
          <td>{data.work_time}</td>
        </tr>
        <tr>
          <td>Training Company</td>
          <td>:</td>
          <td>{data.training_company}</td>
          <td>Minimum Score</td>
          <td>:</td>
          <td>{data.minimum_score}</td>
        </tr>
        <tr>
          <td>License type</td>
          <td>:</td>
          <td>{data.licenses_type}</td>
          <td>Score</td>
          <td>:</td>
          <td>{data.score}</td>
        </tr>
        <tr>
          <td>Exam</td>
          <td>:</td>
          <td>{data.exam_type}</td>
          <td>Pass</td>
          <td>:</td>
          <td>{data.pass ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td>Submission Time</td>
          <td>:</td>
          <td>{Moment.tz(data.submission_time, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}</td>
          <td>License number</td>
          <td>:</td>
          <td>{data.license_number}</td>
        </tr>
        <tr>
          <td>Certificate</td>
          <td>:</td>
          <td>
                    {
                    data.certificate_status === null ? '-' :
                    data.certificate_status === 'Sent' ? <a href={data.certificate} target="_blank"><Badge variant="primary">View</Badge></a> :
                    data.certificate_status === 'Processing' ? <Badge variant="warning">{data.certificate_status}</Badge> :
                    <Badge variant="danger">{data.certificate_status}</Badge>
                    }
          </td>
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
                                                                <div className="form-field-top-label" style={{width:300}}>
                                                                    <label for="cert">Certificate</label>
                                                                    <MultiSelect id="cert" options={this.state.optionsCert} value={this.state.valueCert} onChange={e => this.handleChangeFilter('valueCert', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Certificate Status" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner
                                              text='Loading...'
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20 table-f-small">
                                                        <strong className="f-w-bold f-18" style={{color:'#000', marginBottom:20}}>Data</strong>
                                                        <DataTableExtensions print={false} export exportHeaders columns={columns} data={data} filterPlaceholder='Filter Data'>
                                                          <DataTable
                                                          columns={columns}
                                                          data={data}
                                                          highlightOnHover
                                                          pagination
                                                          fixedHeader
                                                          selectableRows={Storage.get('user').data.level !== 'client'}
                                                          expandableRows
                                                          expandableRowsComponent={<ExpanableComponent />}
                                                          paginationPerPage={10}
                                                          paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 250]}
                                                          onSelectedRowsChange={this.onSelectDataTable}
                                                          />
                                                        </DataTableExtensions>
                                                        { Storage.get('user').data.level !== 'client' ? <Button className="btn btn-icademy-primary btn-12" onClick={this.modalSertifikat.bind(this)}>Create Certificate</Button> : null }
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
