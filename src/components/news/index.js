import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';
import { Modal, Badge } from 'react-bootstrap';
import Moment from 'moment-timezone';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      filter:'',
      file:'',
      modalDelete: false,
      deleteId: '',
      isUploading: false,
      modalResultImport: false,
      resultImport: {field: [], data: []}
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

  uploadData = e => {
    e.preventDefault();
    if (!this.state.file){
      toast.warning('Choose the file first')
    }
    else{
      this.setState({isUploading: true})
      let form = new FormData();
      form.append('company_id', this.state.companyId);
      form.append('file', this.state.file)
      API.post(`${API_SERVER}v2/training/questions/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Data import failed')
            this.setState({ isUploading: false, file: '' });
          }
          else{
            this.getUserData()
            this.setState({ isUploading: false, file: '', modalResultImport: true, resultImport: res.data.result });
          }
        }
      })
    }
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }
  closeModalResult = e => {
    this.setState({ modalResultImport: false })
  }

  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }

  delete (id){
    API.delete(`${API_SERVER}v2/news/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete news')
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.success('News deleted');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getList(companyId){
    API.get(`${API_SERVER}v2/news/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read news list')
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
        name: 'Thumbnail',
        selector: 'image',
        sortable: true,
        cell: row => <Link to={'/news/'+row.id}><img height="26px" alt={row.name} src={row.image ? row.image : 'assets/images/no-image.png'} /></Link>
      },
      {
        name: 'Title',
        selector: 'title',
        sortable: true,
        grow: 2,
        cell: row => <Link to={'/news/'+row.id}>{row.title}</Link>
      },
      {
        cell: row => Moment.tz(row.created_at, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
        name: 'Created at',
        selector: 'created_at',
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
                case 1 : this.props.history.push('/news/edit/' + row.id);break;
                case 2 : this.onClickHapus(row.id);break;
                default : this.props.goTo('/news');break;
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
              <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
        omit: Storage.get('user').data.level === 'client' ? true : false
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
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>News</strong>
                                                        {
                                                            Storage.get('user').data.level !== 'client' ?
                                                            <Link
                                                            to={`/news/create`}>
                                                                <button
                                                                className="btn btn-icademy-primary float-right"
                                                                style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                                    <i className="fa fa-plus"></i>
                                                                    Create New
                                                                </button>
                                                            </Link>
                                                            : null
                                                        }
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
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this news ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.deleteId)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default News;
