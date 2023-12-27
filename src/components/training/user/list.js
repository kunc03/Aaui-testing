import React, { Component } from 'react';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DataTable from 'react-data-table-component';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import moment from 'moment-timezone';
import { MultiSelect } from 'react-sm-select';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import * as XLSX from 'xlsx';
import ReactSelect from 'react-select';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCompany: null,
      selectedCompany: null,
      selectedProvince: null,
      selectedCity: null,
      dataProvince: null,
      dataByProvince: null,
      dataCity: null,
      usersData: null,
      userId: '',
      companyId: '',
      data: [],
      filter: '',
      isSending: false,
      notifMessage: '',
      modalNotif: false,
      notifUserId: '',
      notifUserName: '',
      modalDelete: false,
      deleteId: '',
      modalActivate: false,
      activateId: '',
      dataState: false,
      level: '',
      import: true,
      file: '',
      isUploading: false,
      isLoading: false,
      modalAssignee: false,
      userAssigneeId: '',
      assignee: [
        {
          name: '',
          assignee: [],
        },
      ],
      optionsExam: [],
      valueExam: [],
      optionsCompany: [],
      valueCompany: [],
      isSaving: false,
      listDataExport: [],
    };
    this.goBack = this.goBack.bind(this);
  }

  closeModalDelete = (e) => {
    this.setState({ modalDelete: false, deleteId: '' });
  };
  closeModalNotif = (e) => {
    this.setState({ modalNotif: false, notifUserId: '' });
  };
  closeModalAssignee = (e) => {
    this.setState({ modalAssignee: false, userAssigneeId: '', valueExam: [] });
  };
  closeModalActivate = (e) => {
    this.setState({ modalActivate: false, activateId: '' });
  };

  assign() {
    this.setState({ isSaving: true });
    if (this.state.valueExam.length) {
      let form = {
        exam_id: String(this.state.valueExam),
        training_user_id: this.state.userAssigneeId,
        created_by: this.state.userId,
      };
      API.post(`${API_SERVER}v2/training/assign`, form).then((res) => {
        if (res.data.error) {
          toast.error(`Error assign`);
          this.setState({ isSaving: false });
        } else {
          if (res.data.result === 'validationError') {
            toast.error(res.data.message);
            this.setState({ isSaving: false });
          } else {
            this.readAssign(form.training_user_id);
            toast.success(`Assignment success`);
            this.setState({ isSaving: false });
          }
        }
      });
    } else {
      toast.warning('Select exam');
      this.setState({ isSaving: false });
    }
  }

  getCompany(id) {
    API.get(`${API_SERVER}v2/training/company/${id}`).then((res) => {
      const data = res.data.result.map((item) => ({ value: item.id, label: item.name, company_id: item.company_id }));
      this.setState({ dataCompany: data });
      if (res.data.error) {
        toast.error('Error read company');
      } else {
        if (!this.state.optionsCompany.length) {
          res.data.result.map((item) => {
            this.state.optionsCompany.push({ label: item.name, value: item.id });
          });
        }
      }
    });
  }
  cancelAssign(id) {
    API.delete(`${API_SERVER}v2/training/assign/${id}/${this.state.userId}`).then((res) => {
      if (res.data.error) {
        toast.error(`Error cancel`);
      } else {
        toast.success(`Assignment canceled`);
        this.readAssign(this.state.userAssigneeId);
      }
    });
  }

  onClickHapus(id) {
    this.setState({ modalDelete: true, deleteId: id });
  }
  onClickActivate(id) {
    this.setState({ modalActivate: true, activateId: id });
  }

  delete(id) {
    this.setState({ isSaving: true });
    API.delete(`${API_SERVER}v2/training/user/${id}`).then((res) => {
      if (res.data.error) {
        toast.error(`Error delete ${this.state.level}`);
        this.setState({ isSaving: false });
      } else {
        this.getUserData(true);
        this.closeModalDelete();
        toast.success(`${this.state.level} deactivated`);
        this.setState({ isSaving: false });
      }
    });
  }
  activate(id) {
    this.setState({ isSaving: true });
    API.put(`${API_SERVER}v2/training/user-activate/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error activate user');
        this.setState({ isSaving: false });
      } else {
        this.closeModalActivate();
        this.getUserData(false);
        toast.success('User activated');
        this.setState({ isSaving: false });
      }
    });
  }
  sendNotif() {
    this.setState({ isSending: true });
    if (!this.state.notifMessage) {
      toast.warning('Message is required. Please fill notification message.');
      this.setState({ isSending: false });
    } else {
      let form = {
        user_id: this.state.notifUserId,
        type: 12,
        activity_id: 0,
        desc: this.state.notifMessage,
        dest: '',
      };
      API.post(`${API_SERVER}v1/notification/broadcast`, form).then((res) => {
        if (res.data.error) {
          toast.error('Error send notification');
        } else {
          this.closeModalNotif();
          toast.success('Notification sent');
          this.setState({ isSending: false, notifMessage: '' });
        }
      });
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  };

  getUserData(state) {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
          userId: res.data.result.user_id,
        });
        this.getCompany(this.state.companyId);
        let level = Storage.get('user').data.level;
        this.getDataExportUser(
          this.props.trainingCompany,
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
        ); //Export CSV
        if (this.props.trainingCompany) {
          this.getUserTrainingCompany(this.props.trainingCompany, state);
        } else {
          this.getUser(this.state.companyId, state);
        }
      }
    });
  }

  getDataExportUser(idTraining, idCompany) {
    const level = Storage.get('user').data.level,
      grup = Storage.get('user').data.grup_name;
    if (level === 'client' && grup === 'Admin Training') {
      this.getUserTrainingCompanyLevelUser('user', idTraining);
      this.getUserTrainingCompanyLevelUser('admin', idTraining);
    } else if (level === 'admin' || level === 'superadmin') {
      this.getAdminTrainingCompanyByIdCompany('user', idCompany);
      this.getAdminTrainingCompanyByIdCompany('admin', idCompany);
    }
  }

  getExam(companyId, user) {
    API.get(`${API_SERVER}v2/training/exam/${companyId}/1?assignto=${user}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read exam list');
      } else {
        if (this.state.optionsExam.length === 0) {
          res.data.result.map((item) => {
            this.state.optionsExam.push({ label: `Exam : ${item.title}`, value: item.id });
          });
          API.get(`${API_SERVER}v2/training/exam/${companyId}/0`).then((res) => {
            if (res.data.error) {
              toast.error('Error read exam list');
            } else {
              res.data.result.map((item) => {
                this.state.optionsExam.push({ label: `Quiz : ${item.title}`, value: item.id });
              });
            }
          });
        }
      }
    });
  }

  getUser(id, state) {
    this.setState({ isLoading: true, dataState: state });
    API.get(`${API_SERVER}v2/training/user${state ? '' : '-archived'}/${this.state.level}/${id}`).then((res) => {
      if (res.data.error) {
        toast.error(`Error read ${this.state.level}`);
        this.setState({ isLoading: false });
      } else {
        this.setState({ data: res.data.result, usersData: res.data.result, isLoading: false });
      }
    });
  }

  getAdminTrainingCompanyByIdCompany(level, id) {
    API.get(`${API_SERVER}v2/training/user/${level}/${id}`).then((res) => {
      if (res.data.error) {
        toast.error(`Error read ${this.state.level}`);
      } else {
        let dataExport = this.state.listDataExport.concat(res.data.result);
        this.setState({ listDataExport: dataExport });
      }
    });
  }

  getUserTrainingCompany(id, state) {
    this.setState({ isLoading: true, dataState: state });
    API.get(`${API_SERVER}v2/training/user${state ? '' : '-archived'}/training-company/${this.state.level}/${id}`).then(
      (res) => {
        if (res.data.error) {
          toast.error(`Error read ${this.state.level}`);
          this.setState({ isLoading: false });
        } else {
          this.setState({ data: res.data.result, isLoading: false });
        }
      },
    );
  }

  getUserTrainingCompanyLevelUser(level, id) {
    API.get(`${API_SERVER}v2/training/user/training-company/${level}/${id}`).then((res) => {
      if (res.data.error) {
        this.setState({ isLoading: false });
      } else {
        let dataExport = this.state.listDataExport.concat(res.data.result);
        this.setState({ listDataExport: dataExport });
      }
    });
  }

  handleChangeFile = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };
  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  uploadData = (e) => {
    e.preventDefault();
    if (!this.state.file) {
      toast.warning('Choose the file first');
    } else {
      this.setState({ isUploading: true });
      let form = new FormData();
      form.append('company_id', this.state.companyId);
      form.append('level', this.state.level);
      form.append('created_by', this.state.userId);
      form.append('file', this.state.file);
      API.post(`${API_SERVER}v2/training/user/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(res.data.result);
            this.setState({ isUploading: false, file: '' });
          } else {
            this.getUserData(true);
            toast.success('Data import success');
            this.setState({ isUploading: false, file: '' });
          }
        }
      });
    }
  };

  readAssign(id) {
    this.setState(
      {
        modalAssignee: true,
        userAssigneeId: id,
        valueExam: [],
      },
      () => {
        this.setState({ optionsExam: [] });
      },
    );
    this.getExam(this.state.companyId, id);

    API.get(`${API_SERVER}v2/training/assignee/${id}`).then((res) => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Read assignee failed');
        } else {
          this.setState({
            assignee: res.data.result,
            valueExam: [],
          });
          this.state.optionsExam.map((item) => {
            if (this.state.assignee.assignee.filter((x) => x.exam_id === item.value && x.status === 'Open').length) {
              item.label = '✅ ' + item.label;
            }
          });
        }
      }
    });
  }

  filterByCompany = (e) => {
    const originalData = this.state.usersData;
    if (e) {
      const filteredCompany = originalData.filter((item) => item.training_company_id === e.value);
      this.setState({ data: filteredCompany });
    } else {
      this.setState({ data: originalData });
    }
  };

  filterByRegion = (e, type) => {
    console.log(e);
    let { data } = this.state;
    const originalData = this.state.usersData;
    if (e && type === 'province') {
      this.setState({ selectedProvince: e });
      data = data.filter((item) => item.prov_id === e.value);
      console.log(data);
      this.setState({ data });
    } else {
      this.setState({ data: originalData });
    }
  };

  filterByProvince = (e) => {
    this.setState({ selectedProvince: e });
    const originalData = this.state.usersData;
    if (e) {
      const filteredProvince = originalData.filter((item) => item.prov_id === e.value);
      this.setState({ data: filteredProvince, dataByProvince: filteredProvince });
    } else {
      this.setState({ data: originalData, selectedCity: null });
    }
  };

  filterByCity = (e) => {
    this.setState({ selectedCity: e });
    const originalData = this.state.dataByProvince;
    if (e) {
      const filteredCity = originalData.filter((item) => item.city_id === e.value);
      this.setState({ data: filteredCity });
    } else {
      this.setState({ data: originalData });
    }
  };

  fetchProvince = async () => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/provinces`);
      const data = response.data.result.map((item) => ({ value: item.prov_id, label: item.prov_name }));
      this.setState({ dataProvince: data });
    } catch (error) {
      toast.error('Error read province');
    }
  };

  fetchCityByProvince = async (prov_id) => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/cities/${prov_id}`);
      const data = response.data.result.map((item) => ({ value: item.city_id, label: item.city_name }));
      this.setState({ dataCity: data });
    } catch (error) {
      toast.error('Error read city');
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedProvince !== this.state.selectedProvince) {
      if (this.state.selectedProvince) {
        this.fetchCityByProvince(this.state.selectedProvince.value);
        console.log('state province changed', this.state.selectedProvince.value);
      } else {
        this.setState({ dataCity: null });
      }
    }
  }

  componentDidMount() {
    this.fetchProvince();
    this.getUserData(true);
    this.setState({
      level: this.props.level ? this.props.level : 'user',
      import: this.props.import ? this.props.import : false,
    });
  }

  render() {
    console.log(this.props.trainingCompany);
    const ExportCSV = ({ csvData, fileName }) => {
      // const role = this.state.role
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

      let arr = [];
      if (csvData.length > 0) {
        const levelUser = Storage.get('user').data.level.toLowerCase();

        csvData =
          levelUser === 'superadmin' || levelUser === 'admin'
            ? csvData
            : csvData.filter((str) => str.training_company_id === parseInt(this.props.trainingCompany));

        csvData.forEach((str, index) => {
          let obj = {
            No: index + 1,
            Name: str.name,
            Address: str.address,
            City: str.city_name,
            Province: str.prov_name,
            DateOfBirth: moment(str.born_date).format('DD-MM-YYYY'),
            PlaceOfBirth: str.born_place,
            Company: str.company,
            Email: str.email,
            Gender: str.gender,
            Identity: str.identity,
            Phone: str.phone,
            LicenseNumber: str.license_number,
            Level: str.level,
          };
          arr.push(obj);
        });
        csvData = arr;
      }

      const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        ws['!cols'] = [
          { width: 5 }, // width of Number
          { width: 18 }, // width of Name
          { width: 25 }, // width of Address
          { width: 20 }, // width of City
          { width: 20 }, // width of Province
          { width: 15 }, // width of DateOfBirth
          { width: 15 }, // width of PlaceOfBirth
          { width: 25 }, // width of Company
          { width: 20 }, // width of Email
          { width: 15 }, // width of Gender
          { width: 15 }, // width of Identity
          { width: 15 }, // width of Phone
          { width: 25 }, // width of LicenseNumber
          { width: 10 }, // width of Level
        ];
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        let url = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      return (
        <button
          className="button-gradient-blue"
          style={{ marginLeft: 20 }}
          onClick={(e) => exportToCSV(csvData, fileName)}
        >
          Export Data User
        </button>
      );
    };

    const columns = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: (row) => (
          <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
        ),
      },
      {
        name: 'Identity Image',
        selector: 'identity_image',
        sortable: true,
        cell: (row) => (
          <img
            height="36px"
            alt={row.identity}
            src={row.identity_image ? row.identity_image : 'assets/images/no-image.png'}
          />
        ),
      },
      {
        cell: (row) => <Link to={'/training/user/detail/' + row.id}>{row.name}</Link>,
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
        cell: (row) => moment.tz(row.created_at, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm'),
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
        name: 'Province',
        selector: 'prov_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        width: '130px',
      },
      {
        name: 'City',
        selector: 'city_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        width: '150px',
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
        cell: (row) => (
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey) {
                case 1:
                  this.readAssign(row.id);
                  break;
                case 2:
                  this.setState({ modalNotif: true, notifUserId: row.id, notifUserName: row.name });
                  break;
                case 3:
                  this.props.goTo('/training/user/detail/' + row.id);
                  break;
                case 4:
                  this.props.goTo('/training/user/edit/' + row.id);
                  break;
                case 5:
                  this.onClickHapus(row.id);
                  break;
                case 6:
                  this.onClickActivate(row.id);
                  break;
                default:
                  this.props.goTo('/training/user');
                  break;
              }
            }}
          >
            <Dropdown.Toggle btnStyle="flat" noCaret iconOnly>
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={1} data-id={row.id}>
                <i className="fa fa-tags" /> Assignment
              </MenuItem>
              <MenuItem eventKey={2} data-id={row.id}>
                <i className="fa fa-bell" /> Notification
              </MenuItem>
              <MenuItem eventKey={3} data-id={row.id}>
                <i className="fa fa-info-circle" /> Detail
              </MenuItem>
              <MenuItem eventKey={4} data-id={row.id}>
                <i className="fa fa-edit" /> Edit
              </MenuItem>
              {this.state.dataState ? (
                <MenuItem eventKey={5} data-id={row.id}>
                  <i className="fa fa-trash" /> Deactivate
                </MenuItem>
              ) : null}
              {!this.state.dataState ? (
                <MenuItem eventKey={6} data-id={row.id}>
                  <i className="fa fa-save" /> Activate
                </MenuItem>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        ),
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
        cell: (row) => (
          <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
        ),
      },
      {
        cell: (row) => <Link to={'/training/user/detail/' + row.id}>{row.name}</Link>,
        name: 'Name',
        sortable: true,
        grow: 2,
      },
      {
        cell: (row) => moment(row.created_at).local().format('DD-MM-YYYY HH:mm'),
        name: 'Created at',
        selector: 'created_at',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Province',
        selector: 'prov_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'City',
        selector: 'city_name',
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
        cell: (row) => (
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey) {
                case 1:
                  this.readAssign(row.id);
                  break;
                case 2:
                  this.setState({ modalNotif: true, notifUserId: row.id, notifUserName: row.name });
                  break;
                case 3:
                  this.props.goTo('/training/user/detail/' + row.id);
                  break;
                case 4:
                  this.props.goTo('/training/user/edit/' + row.id);
                  break;
                case 5:
                  this.onClickHapus(row.id);
                  break;
                case 6:
                  this.onClickActivate(row.id);
                  break;
                default:
                  this.props.goTo('/training/user');
                  break;
              }
            }}
          >
            <Dropdown.Toggle btnStyle="flat" noCaret iconOnly>
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={1} data-id={row.id}>
                <i className="fa fa-tags" /> Assignment
              </MenuItem>
              <MenuItem eventKey={2} data-id={row.id}>
                <i className="fa fa-bell" /> Notification
              </MenuItem>
              <MenuItem eventKey={3} data-id={row.id}>
                <i className="fa fa-info-circle" /> Detail
              </MenuItem>
              <MenuItem eventKey={4} data-id={row.id}>
                <i className="fa fa-edit" /> Edit
              </MenuItem>
              {this.state.dataState ? (
                <MenuItem eventKey={5} data-id={row.id}>
                  <i className="fa fa-trash" /> Deactivate
                </MenuItem>
              ) : null}
              {!this.state.dataState ? (
                <MenuItem eventKey={6} data-id={row.id}>
                  <i className="fa fa-save" /> Activate
                </MenuItem>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        ),
        allowOverflow: true,
        button: true,
        width: '56px',
      },
    ];
    let { data, filter } = this.state;
    if (filter != '') {
      data = data.filter((x) => JSON.stringify(Object.values(x)).match(new RegExp(filter, 'gmi')));
    }
    let { selectedCompany } = this.state;
    // if (valueCompany != '') {
    //   data = data.filter((item) => item.training_company_id === valueCompany[0]);
    //   console.log(valueCompany);
    //   console.log(data);
    // }
    if (selectedCompany) {
      data = data.filter((item) => item.training_company_id === selectedCompany.value);
    } else {
      data = data;
    }

    return (
      <div>
        {/* {this.props.level === 'user' ?
          <div className="card p-20 main-tab-container">
            <div className="row">
                <div className="col-sm-12 m-b-20">
                    <strong className="f-w-bold f-18" style={{color:'#000'}}>Export Users</strong>
                </div>
                <div className="col-sm-12 m-b-20">
                  <ExportCSV csvData={this.state.listDataExport} fileName={`Data-Training-User-${localStorage.getItem('companyName') ? localStorage.getItem('companyName') : Storage.get('user').data.company_name}`} />
                </div>
              </div>
            </div>
        : null} */}
        {this.state.import && (
          <div className="card p-20 main-tab-container">
            <div className="row">
              {this.props.level === 'user' ? (
                <div className="col-md" style={{ borderRight: '1px solid #d7d7d7' }}>
                  <div className="col-sm-12 m-b-20">
                    <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                      Import {this.state.level === 'admin' ? 'Admins' : 'Users'}
                    </strong>
                  </div>
                  <div className="col-sm-12 m-b-20">
                    <a href={`${API_SERVER}template-excel/template-import-training-user.xlsx`}>
                      <button className="button-bordered">
                        <i className="fa fa-download" style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }} />
                        Download Template
                      </button>
                    </a>
                  </div>
                  <form className="col-sm-12 form-field-top-label" onSubmit={this.uploadData}>
                    <label
                      for={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      style={{ cursor: 'pointer', overflow: 'hidden' }}
                    >
                      <div className="button-bordered-grey">{this.state.file ? this.state.file.name : 'Choose'}</div>
                    </label>
                    <input
                      type="file"
                      id={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      name={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      onChange={this.handleChangeFile}
                      onClick={(e) => (e.target.value = null)}
                    />
                    <button type="submit" className="button-gradient-blue" style={{ marginLeft: 20 }}>
                      <i className="fa fa-upload" style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }} />
                      {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="col-sm-12 m-b-20">
                    <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                      Import {this.state.level === 'admin' ? 'Admins' : 'Users'}
                    </strong>
                  </div>
                  <div className="col-sm-12 m-b-20">
                    <a href={`${API_SERVER}template-excel/template-import-training-user.xlsx`}>
                      <button className="button-bordered">
                        <i className="fa fa-download" style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }} />
                        Download Template
                      </button>
                    </a>
                  </div>
                  <form className="col-sm-12 form-field-top-label" onSubmit={this.uploadData}>
                    <label
                      for={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      style={{ cursor: 'pointer', overflow: 'hidden' }}
                    >
                      <div className="button-bordered-grey">{this.state.file ? this.state.file.name : 'Choose'}</div>
                    </label>
                    <input
                      type="file"
                      id={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      name={this.state.level === 'admin' ? 'file-import-admin' : 'file-import'}
                      onChange={this.handleChangeFile}
                      onClick={(e) => (e.target.value = null)}
                    />
                    <button type="submit" className="button-gradient-blue" style={{ marginLeft: 20 }}>
                      <i className="fa fa-upload" style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }} />
                      {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                  </form>
                </>
              )}
              {this.props.level === 'user' && (
                <div className="col-md">
                  <div className="col-sm-12 m-b-20">
                    <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                      Export Users
                    </strong>
                  </div>
                  <div className="col-sm-12 m-b-20">
                    <ExportCSV
                      csvData={this.state.listDataExport}
                      fileName={`Data-Training-User-${
                        localStorage.getItem('companyName')
                          ? localStorage.getItem('companyName')
                          : Storage.get('user').data.company_name
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <LoadingOverlay active={this.state.isLoading} spinner={<BeatLoader size="30" color="#008ae6" />}>
          <div className="card p-20 main-tab-container">
            <div className="row">
              <div className="col-sm-12 m-b-20">
                <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                  {this.state.level === 'admin' ? 'Admins' : 'Users'}
                </strong>
                <Link
                  to={`/training/user/create/${this.state.level}/${
                    this.props.trainingCompany ? this.props.trainingCompany : '0'
                  }`}
                >
                  <button
                    className="btn btn-icademy-primary float-right"
                    style={{ padding: '7px 8px !important', marginLeft: 14 }}
                  >
                    <i className="fa fa-plus"></i>
                    Create New
                  </button>
                </Link>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={this.filter}
                  className="form-control float-right col-sm-3"
                />
                <div className="float-right col-sm-2 lite-filter">
                  {Storage.get('user').data.level === 'client' ||
                  Storage.get('user').data.level === 'superadmin' ||
                  this.props.trainingCompany ? (
                    <ReactSelect
                      options={this.state.dataCity ? this.state.dataCity : []}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Filter City"
                      value={this.state.selectedCity}
                      onChange={(e) => this.filterByCity(e)}
                    />
                  ) : null}
                </div>
                <div className="float-right col-sm-2 lite-filter">
                  {Storage.get('user').data.level === 'client' ||
                  Storage.get('user').data.level === 'superadmin' ||
                  this.props.trainingCompany ? (
                    <ReactSelect
                      options={this.state.dataProvince}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Filter Province"
                      onChange={(e) => this.filterByProvince(e)}
                    />
                  ) : null}
                </div>
                <div className="float-right col-sm-2 lite-filter">
                  {Storage.get('user').data.level === 'client' ||
                  Storage.get('user').data.level === 'superadmin' ||
                  this.props.trainingCompany ? null : (
                    <ReactSelect
                      options={this.state.dataCompany}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Filter Company"
                      onChange={(e) => this.setState({ selectedCompany: e })}
                    />
                  )}
                </div>
                <div
                  class={`text-menu ${!this.state.dataState && 'active'}`}
                  style={{ clear: 'both' }}
                  onClick={this.getUserData.bind(this, false)}
                >
                  Inactive
                </div>
                <div
                  class={`text-menu ${this.state.dataState && 'active'}`}
                  onClick={this.getUserData.bind(this, true)}
                >
                  Active
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
            <div>Are you sure want to deactivate this {this.state.level} ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
              Cancel
            </button>
            <button
              className="btn btn-icademy-primary btn-icademy-red"
              onClick={this.delete.bind(this, this.state.deleteId)}
              disabled={this.state.isSaving}
            >
              <i className="fa fa-trash"></i> {this.state.isSaving ? 'Deactivating...' : 'Deactivate'}
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
                {this.state.assignee.assignee && this.state.assignee.assignee.length ? (
                  this.state.assignee.assignee.map((item) => {
                    return (
                      <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                        <td>{moment.tz(item.created_at, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm')}</td>
                        <td>
                          <span class={`badge badge-${item.exam ? 'primary' : 'secondary'}`}>
                            {item.exam ? 'Exam' : 'Quiz'}
                          </span>{' '}
                          {item.title}
                        </td>
                        <td>{item.status}</td>
                        <td>
                          <span
                            class="badge badge-pill badge-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={this.cancelAssign.bind(this, item.id)}
                          >
                            Cancel
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                    <td colspan="5">There is no assignee</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h4 style={{ padding: 10, marginTop: 20, marginBottom: 10 }}>Assign</h4>
            <div className="form-group row">
              <div className="col-sm-12">
                <label className="bold col-sm-12">Exam / Quiz</label>
                <MultiSelect
                  id="exam"
                  options={this.state.optionsExam}
                  value={this.state.valueExam}
                  onChange={(valueExam) => this.setState({ valueExam })}
                  mode="single"
                  enableSearch={true}
                  resetable={true}
                  valuePlaceholder="Select Exam / Quiz"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalAssignee}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary" onClick={this.assign.bind(this)} disabled={this.state.isSaving}>
              <i className="fa fa-save"></i> {this.state.isSaving ? 'Assigning...' : 'Assign'}
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.modalActivate} onHide={this.closeModalActivate} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure want to activate this user ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalActivate.bind(this)}>
              Cancel
            </button>
            <button
              className="btn btn-icademy-primary"
              onClick={this.activate.bind(this, this.state.activateId)}
              disabled={this.state.isSaving}
            >
              <i className="fa fa-trash"></i> {this.state.isSaving ? 'Activating...' : 'Activate'}
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.modalNotif} onHide={this.closeModalNotif} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Send Notification to {this.state.notifUserName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-field-top-label">
              <label for="notifMessage">
                Notification<required>*</required>
              </label>
              <textarea
                name="notifMessage"
                rows="3"
                cols="60"
                id="address"
                placeholder={!this.state.disabledForm && 'Message...'}
                value={this.state.notifMessage}
                onChange={this.handleChange}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalNotif.bind(this)}>
              Cancel
            </button>
            <button
              className="btn btn-icademy-primary"
              onClick={this.sendNotif.bind(this)}
              disabled={this.state.isSending}
            >
              <i className="fa fa-paper-plane"></i> {this.state.isSending ? 'Sending...' : 'Send'}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default User;
