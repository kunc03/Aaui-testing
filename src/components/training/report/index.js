import React, { Component } from "react";
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from "react-toastify";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DatePicker from "react-datepicker";
import { MultiSelect } from 'react-sm-select';
import moment from 'moment-timezone';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import TabMenuPlan from '../../tab_menu/route_plan';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import './index.css';
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
      optionsCert: [{label: 'None', value: 'No'},{label: 'Sent', value: 'Sent'},{label: 'Failed', value: 'Failed'}],
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
                this.state.optionsLicensesType.push({label: (item.notes && item.notes.length > 0 ? `${item.name} - ${item.notes}` : item.name), value: item.id})
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

  exportToExcel = (columns, data) => {
    // Extract headers from columns
    const headers = columns.map(col => col.name);
  
    // Convert data to the format needed for the worksheet
    const formattedData = data.map(row => {
      const rowData = {};
      columns.forEach(col => {
        rowData[col.name] = row[col.selector] || '-'; // Ensure every row has the column values
      });
      return rowData;
    });
  
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
  
    // Set column widths (adjust as needed)
    ws['!cols'] = [
      { wpx: 150 },  // Name
      { wpx: 100 },  // Born Date
      { wpx: 200 },  // Identity Card Number
      { wpx: 80 },   // Gender
      { wpx: 250 },  // Email
      { wpx: 150 },  // Training Company
      { wpx: 150 },  // License Type
      { wpx: 100 },  // Type
      { wpx: 200 },  // Exam Name
      { wpx: 200 },  // Course
      { wpx: 180 },  // Submission Time
      { wpx: 150 },  // Submission Condition
      { wpx: 150 },  // Work Time (Minute)
      { wpx: 100 },  // Min Score
      { wpx: 100 },  // Score
      { wpx: 80 },   // Pass
      { wpx: 200 },  // License Number
      { wpx: 150 },  // Expired Date
      { wpx: 300 },  // Address
      { wpx: 200 },  // Province
      { wpx: 200 },  // City
      { wpx: 200 },  // District
      { wpx: 200 },  // Sub District
      { wpx: 50 },   // RT
      { wpx: 50 },   // RW
      { wpx: 300 },  // Current Address
      { wpx: 200 },  // Current Province
      { wpx: 200 },  // Current City
      { wpx: 200 },  // Current District
      { wpx: 200 },  // Current Sub District
      { wpx: 50 },   // Current RT
      { wpx: 50 },   // Current RW
      { wpx: 200 },  // Certificate Status (or link)
    ];
  
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Write file
    XLSX.writeFile(wb, 'ICADEMY.xlsx');
  };
  
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
        cell: row => moment(row.born_date).local().format("DD-MM-YYYY") === 'Invalid date' ? '' : moment(row.born_date).local().format("DD-MM-YYYY"),
        name: 'Born Date',
        selector: 'born_date',
        sortable: true,
      },
      {
        name: 'Identity Card Number',
        selector: 'identity',
        sortable: true,
        grow: 2,
        cell: row => row.identity ? `'${row.identity}'` : '-',
      },
      {
        name: 'Gender',
        selector: 'gender',
        sortable: true,
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
        name: 'Type',
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
        cell: row => row.course_name ? row.course_name : '-',
      },
      {
        cell: row => moment(row.submission_time).local().format("DD-MM-YYYY HH:mm"),
        name: 'Submission Time',
        selector: 'submission_time',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Submission Condition',
        selector: 'submission_condition',
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
        grow: 2,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cell: row => row.license_number ? row.license_number : '-',
      },
      {
        cell: row => moment(row.expired).local().format("DD-MM-YYYY") === 'Invalid date' ? '-' : moment(row.expired).local().format("DD-MM-YYYY"),
        name: 'Expired Date',
        selector: 'expired',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cell: row => row.expired ? row.expired : '-',
      },
      {
        name: 'Address',
        selector: 'address',
        sortable: true,
        grow: 2,
        wrap: true,
        cell: row => row.address ? row.address : '-',
      },
      {
        name: 'Province',
        selector: 'province',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.province ? row.province : '-',
      },
      {
        name: 'City',
        selector: 'city',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.city ? row.city : '-',
      },
      {
        name: 'District',
        selector: 'district',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.district ? row.district : '-',
      },
      {
        name: 'Sub District',
        selector: 'sub_district',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.sub_district ? row.sub_district : '-',
      },
      {
        name: 'RT',
        selector: 'rt',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.rt ? row.rt : '-',
      },
      {
        name: 'RW',
        selector: 'rw',
        sortable: true,
        wrap: true,
        cell: row => row.rw ? row.rw : '-',
      },
      {
        name: 'Current Address',
        selector: 'current_address',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.current_address ? row.current_address : '-',
      },
      {
        name: 'Current Province',
        selector: 'current_province',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.current_province ? row.current_province : '-',
      },
      {
        name: 'Current City',
        selector: 'current_city',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.current_city ? row.current_city : '-',
      },
      {
        name: 'Current District',
        selector: 'current_district',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.current_district ? row.current_district : '-',
      },
      {
        name: 'Current Sub District',
        selector: 'current_sub_district',
        grow: 2,
        sortable: true,
        wrap: true,
        cell: row => row.current_sub_district ? row.current_sub_district : '-',
      },
      {
        name: 'Current RT',
        selector: 'current_rt',
        sortable: true,
        wrap: true,
        cell: row => row.current_rt ? row.current_rt : '-',
      },
      {
        name: 'Current RW',
        selector: 'current_rw',
        sortable: true,
        wrap: true,
        cell: row => row.current_rw ? row.current_rw : '-',
      },
      {
        cell: row => row.certificate_status === null ? '-' :
        row.certificate_status === 'Sent' ? <a href={row.certificate} target="_blank"><Badge variant="primary">View</Badge></a> :
        row.certificate_status === 'Processing' ? <Badge variant="warning">{row.certificate_status}</Badge> :
        <Badge variant="danger">{row.certificate_status}</Badge>,
        name: 'Certificate',
        selector: 'certificate_status',
        sortable: true,
        wrap: true,
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
          <td>{data.name || '-'}</td>
          <td>Exam</td>
          <td>:</td>
          <td>{data.exam_name || '-'}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>:</td>
          <td>{data.email || '-'}</td>
          <td>Work Time (Minute)</td>
          <td>:</td>
          <td>{data.work_time || '-'}</td>
        </tr>
        <tr>
          <td>Training Company</td>
          <td>:</td>
          <td>{data.training_company || '-'}</td>
          <td>Minimum Score</td>
          <td>:</td>
          <td>{data.minimum_score || '-'}</td>
        </tr>
        <tr>
          <td>License type</td>
          <td>:</td>
          <td>{data.licenses_type || '-'}</td>
          <td>Score</td>
          <td>:</td>
          <td>{data.score || '-'}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>:</td>
          <td>{data.exam_type}</td>
          <td>Pass</td>
          <td>:</td>
          <td>{data.pass ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td>License number</td>
          <td>:</td>
          <td>{data.license_number ? data.license_number : '-'}</td>
          <td>License Expired</td>
          <td>:</td>
          <td>{data.license_expired ? moment(data.license_expired).local().format("DD-MM-YYYY HH:mm") : '-'}</td>
        </tr>
        <tr>
          <td>License No</td>
          <td>:</td>
          <td>{data.license_no ? data.license_no : '-'}</td>
          <td>License Date</td>
          <td>:</td>
          <td>{data.license_date ? moment(data.license_date).local().format("DD-MM-YYYY HH:mm") :  '-'}</td>
        </tr>
        <tr>
          <td>Submission Time</td>
          <td>:</td>
          <td>{moment(data.submission_time).local().format("DD-MM-YYYY HH:mm")}</td>
          <td>Submission Condition</td>
          <td>:</td>
          <td>{data.submission_condition || '-'}</td>
        </tr>
        <tr>
          <td>Born Date</td>
          <td>:</td>
          <td>{moment(data.born_date).local().format("DD-MM-YYYY") === 'Invalid date' ? '-' : moment(data.born_date).local().format("DD-MM-YYYY")}</td>
          <td>Expired</td>
          <td>:</td>
          <td>{moment(data.expired).local().format("DD-MM-YYYY") === 'Invalid date' ? '-' : moment(data.expired).local().format("DD-MM-YYYY")}</td>
        </tr>
        <tr>
          <td>Identity Card Number</td>
          <td>:</td>
          <td>{data.identity ||  '-'}</td>
          <td>Gender</td>
          <td>:</td>
          <td>{data.gender ||  '-'}</td>
        </tr>

        <tr>
          <td>Address</td>
          <td>:</td>
          <td>{data.address || '-'}</td>
          <td>Current Address</td>
          <td>:</td>
          <td>{data.current_address || '-'}</td>
        </tr>

        <tr>
          <td>Province</td>
          <td>:</td>
          <td>{data.province || '-'}</td>
          <td>Current Province</td>
          <td>:</td>
          <td>{data.current_province || '-'}</td>
        </tr>

        <tr>
          <td>City</td>
          <td>:</td>
          <td>{data.city || '-'}</td>
          <td>Current City</td>
          <td>:</td>
          <td>{data.current_city || '-'}</td>
        </tr>

        <tr>
          <td>District</td>
          <td>:</td>
          <td>{data.district || '-'}</td>
          <td>Current District</td>
          <td>:</td>
          <td>{data.current_district || '-'}</td>
        </tr>

        <tr>
          <td>Sub District</td>
          <td>:</td>
          <td>{data.sub_district || '-'}</td>
          <td>Current District</td>
          <td>:</td>
          <td>{data.current_sub_district || '-'}</td>
        </tr>

        <tr>
          <td>RW</td>
          <td>:</td>
          <td>{data.rw || '-'}</td>
          <td>Current RW</td>
          <td>:</td>
          <td>{data.current_rw || '-'}</td>
        </tr>

        <tr>
          <td>RT</td>
          <td>:</td>
          <td>{data.rt || '-'}</td>
          <td>Current RT</td>
          <td>:</td>
          <td>{data.current_rt || '-'}</td>
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
        <tr>
          <td>Identity Card Number</td>
          <td>:</td>
          <td>{data.identity ||  '-'}</td>
          <td>Gender</td>
          <td>:</td>
          <td>{data.gender ||  '-'}</td>
        </tr>

        <tr>
          <td>Address</td>
          <td>:</td>
          <td>{data.address || '-'}</td>
          <td>Current Address</td>
          <td>:</td>
          <td>{data.current_address || '-'}</td>
        </tr>

        <tr>
          <td>Province</td>
          <td>:</td>
          <td>{data.province || '-'}</td>
          <td>Current Province</td>
          <td>:</td>
          <td>{data.current_province || '-'}</td>
        </tr>

        <tr>
          <td>City</td>
          <td>:</td>
          <td>{data.city || '-'}</td>
          <td>Current City</td>
          <td>:</td>
          <td>{data.current_city || '-'}</td>
        </tr>

        <tr>
          <td>District</td>
          <td>:</td>
          <td>{data.district || '-'}</td>
          <td>Current District</td>
          <td>:</td>
          <td>{data.current_district || '-'}</td>
        </tr>

        <tr>
          <td>Sub District</td>
          <td>:</td>
          <td>{data.sub_district || '-'}</td>
          <td>Current District</td>
          <td>:</td>
          <td>{data.current_sub_district || '-'}</td>
        </tr>

        <tr>
          <td>RW</td>
          <td>:</td>
          <td>{data.rw || '-'}</td>
          <td>Current RW</td>
          <td>:</td>
          <td>{data.current_rw || '-'}</td>
        </tr>

        <tr>
          <td>RT</td>
          <td>:</td>
          <td>{data.rt || '-'}</td>
          <td>Current RT</td>
          <td>:</td>
          <td>{data.current_rt || '-'}</td>
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
                                        <TabMenuPlan title='' selected='History' report={true}/>

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
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20 table-f-small">
                                                        <strong className="f-w-bold f-18" style={{color:'#000', marginBottom:20}}>Data</strong>
                                                        <div className='export'>
                                                            <img src="\assets\images\export.png" alt='export' onClick={() => this.exportToExcel(columns, data)}/> 
                                                            <p>Export</p>
                                                        </div>
                                                        <DataTableExtensions  print={false} export={false} exportHeaders={true} columns={columns} data={data} filterPlaceholder='Filter Data'>
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
                        <input type='text' onChange={this.handleChangeText} name='cert_sign_name' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} placeholder='Signature Name' value={this.state.cert_sign_name} />
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
