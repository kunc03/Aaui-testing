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
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const years = parseInt(moment().format("YYYY"));
console.log = ()=>{};

class ReportMembership extends Component {
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

      month: parseInt(moment().format("M")),
      start: new Date(new Date().setMonth(new Date().getMonth()-1)),
      end: new Date(),
      selectedOrganizer:[],
      optionOrganizer:[],
      selectedPeriod:[],
      optionPeriod:[
        {
          value:"0",
          label: "January - March",
          valueDate:{ start: new Date(`${years}-01-01`), end: new Date(years,3,0) }
        },
        {
          value:"1",
          label: "April - June",
          valueDate:{ start: new Date(`${years}-04-01`), end:new Date(years,6,0) }
        },
        {
          value:"2",
          label: "July - September",
          valueDate:{ start: new Date(`${years}-07-01`), end:new Date(years,9,0) }
        },
        {
          value:"3",
          label: "October - December",
          valueDate:{ start: new Date(`${years}-10-01`), end:new Date(years,12,0) }
        },
        {
          value:"4",
          label: "Manually",
          valueDate:{ start: null, end:null }
        }
      ],
      optionsCompany: [],
      valueCompany: [],
      optionsLicensesType: [],
      valueLicensesType: [],
      submitFilter:false,
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

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  handleChangeFilter = (name, e) => {
    console.log(name,e,"???")
    if(e.length && name !== 'submitFilter'){      
      this.setState({[name]: e})
    }else{
      this.setState({[name]: e}, () => {
          if(name === 'submitFilter' && e){
            // only search after submit
            this.getList();
          }
      })
    }
  }

  getOrganizer(){
    
    API.get(`${API_SERVER}v2/training/settings/organizer/${this.state.companyId}`).then(res => {
        try{
          let optionOrganizer = [];
          
          let selectedOrganizer = [];
          res.data.result.map((item)=>{
              let name = item.name;
              
              optionOrganizer.push({label: name, value: item.id});
          });
          this.setState({ selectedOrganizer,optionOrganizer });
        }catch(e){
          toast.error('Error read organizer list')
            this.setState({isLoading: false})
        }
    })
  }

  getList(){
    this.setState({isLoading: true});
    let form = {
        start: this.state.start,
        end: this.state.end,
        licenses_type: this.state.valueLicensesType,
        company: this.state.companyId,
        training_company: this.state.valueCompany,
        organizer : this.state.selectedOrganizer,
    }

    let period = this.state.selectedPeriod;
    let opPeriod = this.state.optionPeriod;
    if(period.length == 0){
      period = [0];
    }

    let idx = opPeriod.findIndex((str)=>{ return str.value == period[0] });
    if(idx > -1 && opPeriod[idx].value != "4"){ form.start = opPeriod[idx].valueDate.start; form.end = opPeriod[idx].valueDate.end; }

    API.post(`${API_SERVER}v2/training/report/membership`, form).then(res => {
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
          this.getOrganizer();
          
          if(this.state.selectedPeriod.length == 0){
            if(this.state.month <= 3){ this.setState({ selectedPeriod:["0"] }) }
            else if(this.state.month <= 6){ this.setState({ selectedPeriod:["1"] }) }
            else if(this.state.month <= 9){ this.setState({ selectedPeriod:["2"] }) }
            else if(this.state.month <= 12){ this.setState({ selectedPeriod:["3"] }) }
          }
    
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
        name: 'Company Name',
        selector: 'training_company_name',
        sortable: true,
        grow: 4,
        style: {
          color: 'rgba(0,0,0,.54)',
        }
      },
      {
        name: 'User Training',
        selector: 'training_user_name',
        sortable: true,
        grow: 2,
        style: {
          color: 'rgba(0,0,0,.54)',
        }
      },
      {
        name: 'License Type',
        selector: 'license_name',
        sortable: true,
        grow: 2,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cell: row => row.license_name ? row.license_name : '-'
      },
      {
        name: 'Organizer',
        selector: 'organizer_name',
        sortable: true,
        grow: 2,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cell: row => row.organizer_name ? row.organizer_name : '-'
      },
      {
        name: 'License Number',
        selector: 'license_number',
        sortable: true,
        grow: 2,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Gender',
        selector: 'training_user_gender',
        sortable: true,
        grow:0
      },
      {
        name: 'City',
        selector: 'training_user_address_city',
        sortable: true,
        grow:1
      },
      {
        name: 'License Certified',
        selector: 'license_certified',
        sortable: true,
        grow:1
      },
      {
        name: 'License Expired',
        selector: 'license_expired',
        sortable: true,
        grow:1
      },
      {
        name: 'Status',
        selector: 'license_status',
        sortable: true,
        grow:1
      }
    ];
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
                                        <TabMenuPlan title='' selected='Report' report={true}/>

                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Filter</strong>
                                                        <div className="form-section no-border">
                                                            
                                                            <div className="row">
                                                                <div className="form-field-top-label" style={{width:200}}>
                                                                    <label for="pass">Period</label>
                                                                    <MultiSelect id="pass" options={this.state.optionPeriod} value={this.state.selectedPeriod} onChange={(e) =>{ this.handleChangeFilter('selectedPeriod', e); this.setState({ selectedPeriod : e }); }} mode="single" resetable={true} valuePlaceholder="Select Period" />
                                                                </div>
                                                                {
                                                                  this.state.selectedPeriod[0] == "4" && (
                                                                      <>
                                                                        <div className="form-field-top-label">
                                                                            <label for="start">Start Date</label>
                                                                            <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.start} onChange={e => this.handleChangeFilter('start', e)} />
                                                                        </div>
                                                                        <div className="form-field-top-label">
                                                                            <label for="end">End Date</label>
                                                                            <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.end} onChange={e => this.handleChangeFilter('end', e)} />
                                                                        </div>
                                                                      </>
                                                                  )
                                                                }
                                                            </div>
                                                            <div className="row">
                                                              <div className="form-field-top-label" style={{width:"32%"}}>
                                                                    <label for="course">License Type</label>
                                                                    <MultiSelect id="course" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={e => this.handleChangeFilter('valueLicensesType', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select License Type" />
                                                                </div>
                                                                {
                                                                    Storage.get('user').data.level !== 'client' ?
                                                                    <div className="form-field-top-label" style={{width:"32%"}}>
                                                                        <label for="company">Company</label>
                                                                        <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={e => this.handleChangeFilter('valueCompany', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Company" />
                                                                    </div>
                                                                    : null
                                                                }
                                                                <div className="form-field-top-label" style={{width:"32%"}}>
                                                                    <label for="pass">Organizer</label>
                                                                    <MultiSelect id="pass" options={this.state.optionOrganizer} value={this.state.selectedOrganizer} onChange={e => this.handleChangeFilter('selectedOrganizer', e)} mode="tags" enableSearch={true} resetable={true} valuePlaceholder="Select Organizer" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                              <div className="form-field-top-label" style={{width:200}}>
                                                                <br />
                                                                <Button className="btn btn-icademy-primary" onClick={() => this.handleChangeFilter('submitFilter', true)}>
                                                                  Search
                                                                </Button>
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
                                                        <DataTableExtensions print={false} export exportHeaders fileName='Report-membership' columns={columns} data={data} filterPlaceholder='Filter Data'>
                                                          <DataTable
                                                          columns={columns}
                                                          data={data}
                                                          highlightOnHover
                                                          pagination
                                                          fixedHeader
                                                          paginationPerPage={10}
                                                          paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 250]}
                                                          onSelectedRowsChange={this.onSelectDataTable}
                                                          />
                                                        </DataTableExtensions>
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

export default ReportMembership;
