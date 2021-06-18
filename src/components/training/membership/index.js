import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';
import DatePicker from "react-datepicker";
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [],
        filter:'',
        training_company_id: '',
        start: null,
        end: null,
        range1: false,
        range2: false,
        isLoading: false,
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  handleChangeFilter = (name, e) => {
    this.setState({[name]: e}, () => {
        console.log(null)
    })
  }
  changeFilterRange (range){
    if (range === 'range1'){
      this.setState({range1: !this.state.range1, range2: false, start: new Date(), end: new Date(new Date().setMonth(new Date().getMonth()+1))})
    }
    else if (range === 'range2'){
      this.setState({range2: !this.state.range2, range1: false, start: new Date(), end: new Date(new Date().setMonth(new Date().getMonth()+3))})
    }
  }

  getData(companyId){
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    let sql = '';
    this.setState({isLoading: true});
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training'){
      sql = `${API_SERVER}v2/training/membership-training/${this.state.training_company_id}`
    }
    else{
      sql = `${API_SERVER}v2/training/membership/${companyId}`
    }
    API.get(sql).then(res => {
        if (res.data.error){
            toast.error('Error read membership list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getData(this.state.companyId)
        }
    })
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training'){
      API.get(`${API_SERVER}v2/training/user/read/user/${Storage.get('user').data.user_id}`).then(res => {
        if (res.status === 200) {
          this.setState({ training_company_id: res.data.result .training_company_id })
        }
      })
    }
  }

  componentDidMount(){
    this.getUserData()
  }

  onClickHapus(){
      toast.warning('Delete button clicked');
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  render() {
    const columns = [
      {
        name: 'Member Card',
        selector: 'license_card',
        sortable: true,
        cell: row => <a href={row.license_card} target="_blank"><img height="36px" alt={row.license_number} src={row.license_card ? row.license_card : 'assets/images/no-image.png'} /></a>,
        cellExport: row => row.license_card
      },
      {
        cell: row => <Link to={'/training/membership/edit/'+row.id}>{row.license_number}</Link>,
        name: 'License Number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cellExport: row => row.license_number
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Passed',
        selector: 'passed',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Company',
        selector: 'company_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => Moment.tz(row.expired, 'Asia/Jakarta').format("DD-MM-YYYY"),
        name: 'Expired Date',
        selector: 'expired',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              if (eventKey === 1) {
                this.props.history.push('/training/membership/edit/' + row.id);
              }
            }}
          >
            <Dropdown.Toggle
              btnStyle="flat"
              noCaret
              iconOnly
            >
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
        cellExport: row => ({})
      },
    ];
    const ExpanableComponent = ({data}) =>(
      <table className="expandTable">
        <tr>
          <td rowspan='6'>License Card</td>
          <td rowspan='6'>:</td>
          <td rowspan='6'><a href={data.license_card} target="_blank"><img height="100px" alt={data.license_number} src={data.license_card ? data.license_card : 'assets/images/no-image.png'} /></a></td>
        </tr>
        <tr>
          <td>License Number</td>
          <td>:</td>
          <td>{data.license_number}</td>
        </tr>
        <tr>
          <td>Expired Date</td>
          <td>:</td>
          <td>{Moment.tz(data.expired, 'Asia/Jakarta').format("DD-MM-YYYY")}</td>
        </tr>
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>{data.name}</td>
        </tr>
        <tr>
          <td>Passed</td>
          <td>:</td>
          <td>{data.passed}</td>
        </tr>
        <tr>
          <td>Training Company</td>
          <td>:</td>
          <td>{data.company_name}</td>
        </tr>
      </table>
    );
    let {data, filter, start, end} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    if (start != null && end != null) {
      data = data.filter(x => Moment.tz(x.expired, 'Asia/Jakarta') >= start && Moment.tz(x.expired, 'Asia/Jakarta') <= end)
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
                                        <TabMenu title='Training' selected='Membership'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Filter</strong>
                                                        <div className="form-section no-border">
                                                            <div className="row">
                                                                <div className="form-field-top-label">
                                                                    <label for="start">Expired Start Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.start} onChange={e => this.handleChangeFilter('start', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="end">Expired End Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.end} onChange={e => this.handleChangeFilter('end', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label>&nbsp;</label>
                                                                    <div className={`filter-button ${this.state.range1 && 'filter-button-selected'}`} onClick={this.changeFilterRange.bind(this, 'range1')}>Expires in a month</div>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label>&nbsp;</label>
                                                                    <div className={`filter-button ${this.state.range2 && 'filter-button-selected'}`} onClick={this.changeFilterRange.bind(this, 'range2')}>Expires in 3 months</div>
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
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Membership List</strong>
                                                        <DataTableExtensions print={false} export exportHeaders columns={columns} data={data} filterPlaceholder='Filter Data'>
                                                          <DataTable
                                                          columns={columns}
                                                          data={data}
                                                          highlightOnHover
                                                          pagination
                                                          fixedHeader
                                                          expandableRows
                                                          expandableRowsComponent={<ExpanableComponent />}
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

export default Membership;
