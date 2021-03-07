import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [
            {
                id : 1,
                image : 'https://www.kelola.co.id/wp-content/uploads/2021/03/alvin-kurnia-kamal.png',
                name : 'Alvin Kurnia Kamal',
                company : 'PT Asuransi Kelola Teknologi Digital',
                number : '23487519512332',
                status : 'Active',
            },
            {
                id : 2,
                image : 'https://www.kelola.co.id/wp-content/uploads/2019/10/milzam.png',
                name : 'Milzam Hibatullah',
                company : 'PT Asuransi Kelola Teknologi Digital',
                number : '23487519512333',
                status : 'Active',
            },
            {
                id : 3,
                image : 'https://www.kelola.co.id/wp-content/uploads/2021/03/joaldrik-f-wawolumaja.png',
                name : 'Joaldrik F. Wawolumaja',
                company : 'Asuransi Infovesta Utama',
                number : '23487519576964',
                status : 'Active',
            },
        ],
        filter:''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
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
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image} />
      },
      {
        name: 'Name',
        selector: 'name',
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
        name: 'Registration Number',
        selector: 'number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Status',
        selector: 'status',
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
            switch (eventKey){
              case 1 : this.props.history.push('/training/user/detail/'+row.id);break;
              case 2 : this.props.history.push('/training/user/edit/'+row.id);break;
              default : this.props.history.push('/training/user');break;
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
            <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
            <MenuItem data-id={row.id} data-status={row.status} onClick={this.onClickHapus}><i className="fa fa-trash" /> Delete</MenuItem>
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
                                        <TabMenu title='Training' selected='User'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import User</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <button className="button-bordered">
                                                            <i
                                                                className="fa fa-download"
                                                                style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                            />
                                                            Download Template
                                                        </button>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <button className="button-bordered-grey">
                                                            Choose
                                                        </button>
                                                        <button className="button-gradient-blue" style={{marginLeft:20}}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            Upload File
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>User List</strong>
                                                        <Link
                                                        to={`/training/user/create`}>
                                                            <button
                                                            className="btn btn-icademy-primary float-right"
                                                            style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                                <i className="fa fa-plus"></i>
                                                                Create New
                                                            </button>
                                                        </Link>
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

export default User;
