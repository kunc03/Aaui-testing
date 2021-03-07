import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [
            {
                image : 'https://rencanamu.id/assets/file_uploaded/blog/1544666963-uiux-01.png',
                title : 'Pembuatan UI/UX design',
                number : '00001',
                date : '07/03/2021',
                content : 'Text, Video',
                status : 'Active',
            },
            {
                image : 'https://4.bp.blogspot.com/-s2EhTt57oeU/XHtQtO1QNLI/AAAAAAAANW8/KYkPQEZUyocSpA2RzqCcVt31imXPi63RACLcBGAs/s1600/Free%2BCourses%2Bto%2Blearn%2BJavaScript.jpg',
                title : 'Penulisan Coding Javascript',
                number : '00002',
                date : '04/03/2021',
                content : 'PDF, Audio, Practice',
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
        name: 'Thumbnail',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image} />
      },
      {
        name: 'Title',
        selector: 'title',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Number',
        selector: 'number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Publish Date',
        selector: 'date',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Content',
        selector: 'content',
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
                                        <TabMenu title='Training' selected='Course'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Course List</strong>
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

export default Course;
