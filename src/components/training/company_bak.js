import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [
            {
                image : 'https://api.icademy.id/company/img-1590576779013.png',
                name : 'PT Infovesta Utama',
                number : '00001',
                user : '52',
                limit : '300',
                status : 'Active',
            },
            {
                image : 'https://api.icademy.id/company/img-1585740964860.png',
                name : 'PT Kelola Teknologi Digital',
                number : '00002',
                user : '21',
                limit : '700',
                status : 'Active',
            },
        ],
        filter:''
    };
  }

  onClickHapus(){
      toast.warning('Delete button clicked');
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }
  
  componentDidMount(){
      console.log('ALVIN COMPANY RENDER')
  }

  render() {
    const columns = [
      {
        image: 'Logo',
        selector: 'image',
        sortable: true,
        grow: 2,
        cell: row => <img height="26px" alt={row.name} src={row.image} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
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
        name: 'User',
        selector: 'user',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Limit',
        selector: 'limit',
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
              if (eventKey === 1) {
                window.open('/training-company-edit/' + row.id, "_self")
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
        <div>
            <div className="card p-20 main-tab-container">
                <div className="row">
                    <div className="col-sm-12 m-b-20">
                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import Company</strong>
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
                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Company List</strong>
                        <Link
                        to={`/training/company/create`}>
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
    )
  }
}

export default Company;
