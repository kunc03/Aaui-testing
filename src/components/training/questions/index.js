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
import { Modal, Badge } from 'react-bootstrap';
import Moment from 'moment-timezone';

class Questions extends Component {
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
    API.delete(`${API_SERVER}v2/training/questions/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete questions')
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.success('Question deleted');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getList(companyId){
    API.get(`${API_SERVER}v2/training/questions/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read questions list')
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
        name: 'Course',
        selector: 'course',
        sortable: true,
      },
      {
        cell: row => <div dangerouslySetInnerHTML={{__html: (row.question.length > 50 ? row.question.substring(0, 50) + '...' : row.question)}}></div>,
        name: 'Question',
        selector: 'question',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        grow: 2,
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
                case 1 : this.props.history.push('/training/questions/edit/' + row.id);break;
                case 2 : this.onClickHapus(row.id);break;
                default : this.props.goTo('/training/questions');break;
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
                                        <TabMenu title='Training' selected='Questions'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import Questions</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <a href={`${API_SERVER}template-excel/template-import-training-questions.xlsx`}>
                                                          <button className="button-bordered">
                                                              <i
                                                                  className="fa fa-download"
                                                                  style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                              />
                                                              Download Template
                                                          </button>
                                                        </a>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                    </div>
                                                    <form className="col-sm-12 form-field-top-label" onSubmit={this.uploadData}>
                                                        <label for="file-import" style={{cursor:'pointer', overflow:'hidden'}}>
                                                          <div className="button-bordered-grey">
                                                              {this.state.file ? this.state.file.name : 'Choose'}
                                                          </div>
                                                        </label>
                                                        <input type="file" id="file-import" name="file-import" onChange={this.handleChangeFile} />
                                                        <button type="submit" className="button-gradient-blue" style={{marginLeft:20}} disabled={this.state.isUploading}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                                                        </button>
                                                        {
                                                          this.state.resultImport.field.length && this.state.resultImport.data.length ?
                                                          <button type="button" className="button-gradient-green" style={{marginLeft:20}} onClick={()=> this.setState({modalResultImport: true})}>
                                                              <i
                                                                  className="fa fa-table"
                                                                  style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                              />
                                                              Last Import Result
                                                          </button>
                                                          : null
                                                        }
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Questions List</strong>
                                                        <Link
                                                        to={`/training/questions/create`}>
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
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this question ?</div>
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
          
          <Modal show={this.state.modalResultImport} onHide={this.closeModalResult} centered dialogClassName="modal-lg">
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Import Result
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                this.state.resultImport.field.length && this.state.resultImport.data.length ?
                <div>
                  <table className="small-font table table-striped">
                  <thead>
                    <tr>
                      {
                        this.state.resultImport.field.map(item => <th style={{fontSize:10}}>{item}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                      {
                        this.state.resultImport.data.map(item =>
                        <tr>
                          {
                            item.map((items, index)=>
                            <td style={{fontSize: 10}}>
                              {
                                index === 0 && items === 'Success' ? <Badge variant="success">{items}</Badge> :
                                index === 0 && items === 'Failed' ? <Badge variant="danger">{items}</Badge> : 
                                index === 0 && items === 'Warning' ? <Badge variant="warning">{items}</Badge> : 
                                String(items).length > 30 ? items.substring(0, 30) + '...' : items
                              }
                            </td>)
                          }
                        </tr>
                        )
                      }
                  </tbody>
                  </table>
                </div>
                :
                <div>No result</div>
              }
            </Modal.Body>
          </Modal>
        </div>
    )
  }
}

export default Questions;
