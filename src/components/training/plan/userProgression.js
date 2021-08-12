import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import TabMenuPlan from '../../tab_menu/route_plan';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { MultiSelect } from 'react-sm-select';
import { ProgressBar } from 'react-bootstrap';

class UserProgression extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      unassigned : [],
      optionsCompany: [],
      valueCompany: [],
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
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getUser(id){
    this.setState({isLoading: true});
    API.get(`${API_SERVER}v2/training/user/user/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read users`)
            this.setState({isLoading: false});
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
          if (!this.state.optionsCompany.length){
            res.data.result.map(item=>{
                this.state.optionsCompany.push({label: item.name, value: item.id})
            })
          }
        }
    })
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getUser(this.state.companyId);
          this.getCompany(this.state.companyId);
        }
    })
  }

  componentDidMount(){
    this.getUserData()
  }

  render() {
    let {filter, data} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    let { valueCompany } = this.state;
    if (valueCompany != "") {
      data = data.filter(x =>
        x.training_company_id === valueCompany[0]
      )
    }
    const columns = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        cell: row => <Link to={'/training/plan-user/'+row.id}>{row.name}</Link>,
        name: 'Name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Company',
        selector: 'company',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Phone',
        selector: 'phone',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
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
        name: 'Identity Number',
        selector: 'identity',
        sortable: true,
        grow: 2,
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
      },
      {
        cell: row =>
        <div className="progressBar">
            <ProgressBar now={50} label={`${50}%`} />
        </div>,
        name: 'Progression',
        selector: 'progression',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
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
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            onChange={this.filter}
                                                            className="form-control float-right col-sm-3"/>
                                                        <div className="float-right col-sm-3 lite-filter">
                                                            <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={valueCompany => this.setState({ valueCompany })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Filter Company" />
                                                        </div>
                                                        <DataTable
                                                            columns={columns}
                                                            data={data}
                                                            highlightOnHover
                                                            pagination
                                                            fixedHeader
                                                        />
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

export default UserProgression;
