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

class Quota extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      filter:'',
      file:'',
      modalDelete: false,
      deleteId: '',
      isUploading: false
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

  getList(){
    API.get(`${API_SERVER}v2/training/quota/company`).then(res => {
        if (res.data.error){
            toast.error('Error read company list')
        }
        else{
            this.setState({data: res.data.result})
        }
    })
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getList(this.state.companyId)
        }
    })
  }

  componentDidMount(){
    this.getUserData()
  }

  render() {
    const columns = [
      {
        name: 'Logo',
        selector: 'logo',
        cell: row => <img height="26px" alt={row.logo} src={row.logo ? row.logo : 'assets/images/no-logo.jpg'} />
      },
      {
        name: 'Company Name',
        selector: 'company_name',
        grow: 2,
        sortable: true,
        cell: row => <Link to={'/training/quota/detail/'+row.company_id}>{row.company_name}</Link>
      },
      {
        name: 'Total Allocated',
        selector: 'total_allocated',
        sortable: true,
      },
      {
        name: 'Total Used',
        selector: 'total_used',
        sortable: true,
      },
      {
        name: 'Total Amount',
        selector: 'total_amount',
        sortable: true,
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.props.history.push('/training/quota/detail/' + row.company_id);break;
                default : this.props.goTo('/training/quota');break;
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
              <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-edit" /> Detail</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      },
    ];
    let {data, filter} = this.state;
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
                                        <TabMenu title='Training' selected='Quota'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Company & Quota List</strong>
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            onChange={this.filter}
                                                            className="form-control float-right col-sm-3"/>
                                                        <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        highlightOnHover
                                                        defaultSortField="name"
                                                        pagination
                                                        fixedHeader
                                                        />
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

export default Quota;
