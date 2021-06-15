import React, { Component } from "react";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import Moment from 'moment-timezone';
import { MultiSelect } from 'react-sm-select';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userId:'',
        companyId:'',
        data : [],
        filter:'',
        modalDelete:false,
        deleteId:'',
        level:'',
        import: true,
        file:'',
        isUploading: false,
        isLoading: false,
        modalAssignee: false,
        userAssigneeId: '',
        assignee: [{
          name : '',
          assignee : []
        }],
        optionsExam: [],
        valueExam: [],
        optionsCompany: [],
        valueCompany: []
    };
    this.goBack = this.goBack.bind(this);
  }
  
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }
  closeModalAssignee = e => {
    this.setState({ modalAssignee: false, userAssigneeId: '', valueExam: [] })
  }

  assign (){
    if (this.state.valueExam.length){
      let form = {
        exam_id : String(this.state.valueExam),
        training_user_id : this.state.userAssigneeId,
        created_by : this.state.userAssigneeId
      }
      API.post(`${API_SERVER}v2/training/assign`, form).then(res => {
          if (res.data.error){
              toast.error(`Error assign`)
          }
          else{
            if (res.data.result === 'validationError'){
              toast.error(res.data.message);
            }
            else{
              this.readAssign(form.training_user_id);
              toast.success(`Assignment success`);
            }
          }
      })
    }
    else{
      toast.warning('Select exam')
    }
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
  cancelAssign(id){
    API.delete(`${API_SERVER}v2/training/assign/${id}/${this.state.userId}`).then(res => {
        if (res.data.error){
            toast.error(`Error cancel`)
        }
        else{
          toast.success(`Assignment canceled`);
          this.readAssign(this.state.userAssigneeId);
        }
    })
  }
  
  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }

  delete (id){
    API.delete(`${API_SERVER}v2/training/user/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error delete ${this.state.level}`)
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.success(`${this.state.level} deleted`);
        }
    })
  }

  goBack() {
    this.props.history.goBack();
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getCompany(this.state.companyId);
          if (this.props.trainingCompany){
            this.getUserTrainingCompany(this.props.trainingCompany)
          }
          else{
            this.getUser(this.state.companyId)
          }
        }
    })
  }

  getExam(companyId){
    API.get(`${API_SERVER}v2/training/exam/${companyId}/1`).then(res => {
      if (res.data.error){
          toast.error('Error read exam list')
      }
      else{
        if (this.state.optionsExam.length === 0){
          res.data.result.map((item)=>{
            this.state.optionsExam.push({label: `Exam : ${item.title}`, value: item.id})
          })
          API.get(`${API_SERVER}v2/training/exam/${companyId}/0`).then(res => {
            if (res.data.error){
                toast.error('Error read exam list')
            }
            else{
              res.data.result.map((item)=>{
                this.state.optionsExam.push({label: `Quiz : ${item.title}`, value: item.id})
              })
            }
          })
        };
      }
    })
  }

  getUser(id){
    this.setState({isLoading: true});
    API.get(`${API_SERVER}v2/training/user/${this.state.level}/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read ${this.state.level}`)
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  getUserTrainingCompany(id){
    this.setState({isLoading: true});
    API.get(`${API_SERVER}v2/training/user/training-company/${this.state.level}/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read ${this.state.level}`)
            this.setState({isLoading: false});
        }
        else{
          this.setState({data: res.data.result, isLoading: false})
        }
    })
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
      form.append('level', this.state.level);
      form.append('created_by', this.state.userId);
      form.append('file', this.state.file)
      API.post(`${API_SERVER}v2/training/user/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(res.data.result)
            this.setState({ isUploading: false, file: '' });
          }
          else{
            this.getUserData();
            toast.success('Data import success')
            this.setState({ isUploading: false, file: '' });
          }
        }
      })
    }
  }

  readAssign(id){
    this.setState({
      modalAssignee: true,
      userAssigneeId: id
    });
    this.getExam(this.state.companyId);
    
    API.get(`${API_SERVER}v2/training/assignee/${id}`).then((res) => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Read assignee failed')
        }
        else{
          this.setState({
            assignee: res.data.result,
            valueExam: []
          });
        }
      }
    })
  }

  componentDidMount(){
    this.getUserData();
    this.setState({
      level: this.props.level ? this.props.level : 'user',
      import: this.props.import ? this.props.import : false
    })
  }

  render() {
    const columns = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        cell: row => <Link to={'/training/user/detail/'+row.id}>{row.name}</Link>,
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
        cell: row => Moment.tz(row.created_at, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
        name: 'Created at',
        selector: 'created_at',
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
        <Dropdown
          pullRight
          onSelect={(eventKey) => {
            switch (eventKey){
              case 1 : this.readAssign(row.id);break;
              case 2 : this.props.goTo('/training/user/detail/'+row.id);break;
              case 3 : this.props.goTo('/training/user/edit/'+row.id);break;
              case 4 : this.onClickHapus(row.id);break;
              default : this.props.goTo('/training/user');break;
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
            <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-tags" /> Assignment</MenuItem>
            <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-edit" /> Detail</MenuItem>
            <MenuItem eventKey={3} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
            <MenuItem eventKey={4} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem>
          </Dropdown.Menu>
        </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      },
    ];
    const columnsClient = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        cell: row => <Link to={'/training/user/detail/'+row.id}>{row.name}</Link>,
        name: 'Name',
        sortable: true,
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
        <Dropdown
          pullRight
          onSelect={(eventKey) => {
            switch (eventKey){
              case 1 : this.readAssign(row.id);break;
              case 2 : this.props.goTo('/training/user/detail/'+row.id);break;
              case 3 : this.props.goTo('/training/user/edit/'+row.id);break;
              case 4 : this.onClickHapus(row.id);break;
              default : this.props.goTo('/training/user');break;
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
            <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-tags" /> Assignment</MenuItem>
            <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-edit" /> Detail</MenuItem>
            <MenuItem eventKey={3} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
            <MenuItem eventKey={4} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem>
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
    let { valueCompany } = this.state;
    if (valueCompany != "") {
      data = data.filter(x =>
        x.training_company_id === valueCompany[0]
      )
    }
    return(
      <div>
        {
          this.state.import &&
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import {this.state.level === 'admin' ? 'Admins' : 'Users'}</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <a href={`${API_SERVER}template-excel/template-import-training-user.xlsx`}>
                                                          <button className="button-bordered">
                                                              <i
                                                                  className="fa fa-download"
                                                                  style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                              />
                                                              Download Template
                                                          </button>
                                                        </a>
                                                    </div>
                                                    <form className="col-sm-12 form-field-top-label" onSubmit={this.uploadData}>
                                                        <label for={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'} style={{cursor:'pointer', overflow:'hidden'}}>
                                                          <div className="button-bordered-grey">
                                                              {this.state.file ? this.state.file.name : 'Choose'}
                                                          </div>
                                                        </label>
                                                        <input type="file" id={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'} name={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}onChange={this.handleChangeFile} />
                                                        <button type="submit" className="button-gradient-blue" style={{marginLeft:20}}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
        }
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.state.level === 'admin' ? 'Admins' : 'Users'}</strong>
                                                        <Link
                                                        to={`/training/user/create/${this.state.level}/${this.props.trainingCompany ? this.props.trainingCompany : '0'}`}>
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
                                                        <div className="float-right col-sm-3 lite-filter">
                                                          {
                                                            Storage.get('user').data.level === 'client' ? null :
                                                            <MultiSelect id="company" options={this.state.optionsCompany} value={this.state.valueCompany} onChange={valueCompany => this.setState({ valueCompany })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Filter Company" />
                                                          }
                                                        </div>
                                                        <DataTable
                                                        columns={Storage.get('user').data.level === 'client' ? columnsClient : columns}
                                                        data={data}
                                                        highlightOnHover
                                                        pagination
                                                        fixedHeader
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            </LoadingOverlay>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this {this.state.level} ?</div>
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
        <Modal show={this.state.modalAssignee} onHide={this.closeModalAssignee} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Assignment : {this.state.assignee.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-hover">
              <thead>
                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                  <td>Assignee Date</td>
                  <td>Exam / Quiz</td>
                  <td>Status</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.assignee.assignee && this.state.assignee.assignee.length ?
                    this.state.assignee.assignee.map((item) => {
                      return (
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td>{Moment.tz(item.created_at, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}</td>
                          <td><span class={`badge badge-${item.exam ? 'primary' : 'secondary'}`}>{item.exam ? 'Exam' : 'Quiz'}</span> {item.title}</td>
                          <td>{item.status}</td>
                          <td>
                            <span class="badge badge-pill badge-danger" style={{ cursor: 'pointer' }} onClick={this.cancelAssign.bind(this, item.id)}>Cancel</span>
                          </td>
                        </tr>
                      )
                    })
                    :
                    (<tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                      <td colspan='5'>There is no assignee</td>
                    </tr>)
                }
              </tbody>
            </table>

            <h4 style={{ padding: 10, marginTop: 20, marginBottom: 10 }}>Assign</h4>
            <div className="form-group row">
              <div className="col-sm-12">
                <label className="bold col-sm-12">Exam / Quiz</label>
                <MultiSelect id="exam" options={this.state.optionsExam} value={this.state.valueExam} onChange={valueExam => this.setState({ valueExam })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Exam / Quiz" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalAssignee}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary" onClick={this.assign.bind(this)}>
              <i className="fa fa-save"></i> Assign
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default User;
