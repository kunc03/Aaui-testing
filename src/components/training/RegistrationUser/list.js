import React, { Component } from 'react';
import API, { API_SERVER, USER_ME, DEV_MODE } from '../../../repository/api';
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
import { Editor } from '@tinymce/tinymce-react';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filter: '',
      rowSelected: [],
      dataSelected: [],
      modalDetail: false,
      isSaving: false,
      toggledClearRows: false,
      optionsCompany: [],
      valueCompany: [],

      optionsPayment: [{ label: 'Paid', value: '1' }, { label: 'Unpaid', value: '0' }],
      valuePayment: []
    };
  }

  getUserRegistration(idTrainingCompany, isTrainingCompany) {
    this.setState({ isLoading: true });
    API.get(`${API_SERVER}v2/training/user-registration/${idTrainingCompany}?isTrainingCompany=${isTrainingCompany}`).then((res) => {
      if (res.data.error) {
        toast.error(`Error read List User Registration`);
        this.setState({ isLoading: false });
      } else {
        let parseData = res.data.result.map((data) => {
          let parsingData = JSON.parse(data.data);
          Object.keys(parsingData).forEach((properties) => {
            parsingData[properties.toLowerCase()] = parsingData[properties];
          });
          let free = '-'
          if(data.is_paid){
            if(data.status){
              free = 'Paid'
            }else{
              free = 'Unpaid'
            }
          }
          return {
            id: data.id,
            training_company_name: data.training_company_name,
            statusPayment: free/*Math.round(Math.random())*/,
            ...parsingData,
          };
        });

        this.setState({ data: parseData, isLoading: false, dataSelected: [] });
      }
    });
  }

  getCompany(id) {
    API.get(`${API_SERVER}v2/training/company/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read company');
      } else {
        if (!this.state.optionsCompany.length) {
          const isLevelUserClient = Storage.get('user').data.level === "client";
          const isGrupNameAdminTraining = Storage.get('user').data.grup_name === "Admin Training";
          const idCompanyTraining = Storage.get('user').data.training_company_id;
          if(isLevelUserClient && isGrupNameAdminTraining){
            res.data.result = res.data.result.filter(data  => data.id === idCompanyTraining);
            if(res.data.result.length) {
              this.setState({valueCompany: [idCompanyTraining]});
            }
          }
          
          res.data.result.map((item) => {
            this.state.optionsCompany.push({ label: item.name, value: item.id });
          });

          this.forceUpdate();
        }
      }
    });
  }

  getTrainingCompanyByCompany() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
          userId: res.data.result.user_id,
        });
        this.getUserRegistration(this.state.companyId, false);
        this.getCompany(this.state.companyId);
      }
    });
  }

  changeFilterCompany (valueCompany) {
    if(valueCompany.length) {
      this.getUserRegistration(valueCompany[0], true);
    }else{
      const isLevelUserClient = Storage.get('user').data.level === "client";
      const isGrupNameAdminTraining = Storage.get('user').data.grup_name === "Admin Training";
      if(!(isLevelUserClient && isGrupNameAdminTraining)){
        this.getUserRegistration(this.state.companyId, false); 
      }       
    }

    this.setState({ valueCompany })
  }

  componentDidMount() {
    this.getTrainingCompanyByCompany();
  }

  //Function Toogle for Modal Only
  toogleModal = (properties) => {
    this.setState({ [properties]: !this.state[properties] });
  };

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  };

  checkTypeInput = (properties, valueSelected) => {
    const inputName = properties;
    if (properties === 'id') {
      return;
    }
    if (Array.isArray(valueSelected)) {
      return (
        <div className="form-field-top-label">
          <label for="media">{inputName}</label>
          <div className="training-session-media">
            {valueSelected.length
              ? valueSelected.map((item, index) => {
                  let icon = 'fa-paperclip';
                  switch (item.type) {
                    case 'PDF':
                      icon = 'fa-file-pdf';
                      break;
                    case 'Word':
                      icon = 'fa-file-word';
                      break;
                    case 'Excel':
                      icon = 'fa-file-excel';
                      break;
                    case 'PowerPoint':
                      icon = 'fa-file-powerpoint';
                      break;
                    case 'Image':
                      icon = 'fa-image';
                      break;
                    case 'Video':
                      icon = 'fa-file-video';
                      break;
                    case 'Audio':
                      icon = 'fa-file-audio';
                      break;
                    default:
                      icon = 'fa-paperclip';
                  }
                  return (
                    <div className="training-session-media-list">
                      {item.url ? (
                        <a href={item.url} target="_blank" style={{ color: '#000' }} rel="noopener noreferrer">
                          <i className={`fa ${icon}`}></i>&nbsp;
                          {item.name || item.labelName || item || '-'}
                        </a>
                      ) : (
                        <div>{item.name || item.labelName || item || '-'}</div>
                      )}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      );
    } else {
      return (
        <>
          <label className="form-label" for={inputName}>
            {inputName}
          </label>
          <input
            type="text"
            name={inputName}
            id={inputName}
            className="form-control form-control-lg"
            value={valueSelected}
            style={{ position: 'relative', width: '100%', opacity: 1 }}
          />
        </>
      );
    }
  };

  removeUserBulk = () => {
    this.setState({ isSaving: true });
    const allIDSelected = this.state.dataSelected.map((data) => {
      return data.id;
    });

    const objPost = {
      idUserRegistration: allIDSelected,
    };

    API.post(`${API_SERVER}v2/training/remove-user-registration`, objPost).then((res) => {
      if (res.data.error) {
        if(res.data.result.length){
          res.data.result.forEach(data => {
            toast.error(data.message);
          })
        }else{
          toast.error(res.data.result);
        }
        this.setState({ isSaving:false } )
      } else {
        this.toogleModal.bind(this, 'modalRemove')();
        toast.success(res.data.result);
        this.setState({ isSaving: false, toggledClearRows: true });
      }

      if(this.state.valueCompany.length) {
        this.getUserRegistration(this.state.valueCompany[0], true);
      }else {
        this.getUserRegistration(this.state.companyId, false);
      }
    });
  };

  clearAllModal () {
    this.setState({
      modalActivate: false,
      modalDetail: false,
      modalRemove: false
    })
  }

  activateUserBulk = () => {
    this.setState({ isSaving: true });
    const allIDSelected = this.state.dataSelected.map((data) => {
      return data.id;
    });

    const objPost = {
      idUserRegistration: allIDSelected,
    };

    API.post(`${API_SERVER}v2/training/activate-user-registration`, objPost).then((res) => {
      if (res.data.error) {
        if(res.data.result.length){
          res.data.result.forEach(data => {
            toast.error(data.message);
          })
        }else{
          toast.error(res.data.result);
        }
        this.setState({ isSaving:false } )
      } else {
        this.clearAllModal.bind(this)();
        toast.success(res.data.result);
        this.setState({ isSaving: false, toggledClearRows: true });
      }

      if(this.state.valueCompany.length) {
        this.getUserRegistration(this.state.valueCompany[0], true);
      }else {
        this.getUserRegistration(this.state.companyId, false);
      }
    });
  };

  onSelectDataTable = (e) => {
    this.setState({ dataSelected: e.selectedRows });
  };

  changeFilterPayment (valuePayment) {
    this.setState({ valuePayment })
  }

  render() {
    const isLevelUserClient = Storage.get('user').data.level === "client";
    const isGrupNameAdminTraining = Storage.get('user').data.grup_name === "Admin Training";

    try {
      let columns = [
        {
          // cell: row => <Link to={'/training/user/detail/' + row.id}>{row.name}</Link>,
          name: 'Name',
          selector: 'name',
          sortable: true,
        },
        {
          name: 'Company',
          selector: 'training_company_name',
          sortable: true,
          style: {
            color: 'rgba(0,0,0,.54)',
          },
          grow: 2,
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
          cell: (row) => moment.tz(row.created_at, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm'),
          name: 'Created at',
          selector: 'created_at',
          sortable: true,
          style: {
            color: 'rgba(0,0,0,.54)',
          },
        },
        {
          cell: (row) => row.statusPayment,
          name: 'Payment Status',
          selector: 'payment_status',
          sortable: true,
          style: {
            color: '#00ad0d',
          },
        },
        {
          cell: (row) => (
            <Dropdown
              pullRight
              onSelect={(eventKey) => {
                switch (eventKey) {
                  case 1:
                    this.setState({ modalDetail: true, rowSelected: row,dataSelected: [row] });
                    break;
                  case 2:
                    this.setState({ modalActivate: true, dataSelected: [row] });
                    break;
                  case 3:
                    this.setState({ modalRemove: true, dataSelected: [row] });
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
                  <i className="fa fa-info-circle" /> Detail
                </MenuItem>
                <MenuItem eventKey={2} data-id={row.id}>
                  <i className="fa fa-save" /> Activate
                </MenuItem>
                <MenuItem eventKey={3} data-id={row.id}>
                  <i className="fa fa-trash" /> Remove
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          ),
          allowOverflow: true,
          button: true,
          width: '56px',
        },
      ];
      let { data, filter, valuePayment } = this.state;
      if (filter != '') {
        data = data.filter((x) => JSON.stringify(Object.values(x)).match(new RegExp(filter, 'gmi')));
      } else if (valuePayment.length){
        data = data.filter((dt) => dt.statusPayment == valuePayment[0]);
      }

      const HeaderTable = (e) => {
        return (
          <div style={{ width: '100%' }}>
            <h5 className="float-left" style={{ lineHeight: '44px' }}>
              {this.state.dataSelected.length} {this.state.dataSelected.length === 1 ? 'user' : 'users'} selected
            </h5>
            <button
              disabled={this.state.isSaving}
              onClick={this.activateUserBulk.bind(this)}
              className="btn btn-icademy-primary float-right"
              style={{ padding: '7px 8px !important', marginLeft: 30, marginTop: 5 }}
            >
              <i className="fa fa-user-plus"></i>
              {this.state.isSaving
                ? 'Activating...'
                : `Activate ${this.state.dataSelected.length} ${
                    this.state.dataSelected.length === 1 ? 'User' : 'Users'
                  }`}
            </button>
          </div>
        );
      };

      return (
        <div>
          <LoadingOverlay active={this.state.isLoading} spinner={<BeatLoader size="30" color="#008ae6" />}>
            <div className="card p-20 main-tab-container">
              <div className="row">
                <div className="col-sm-12 m-b-20">
                  <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                    {'Users'}
                  </strong>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={this.filter}
                    className="form-control float-right col-sm-3"
                  />

                  <div className="float-right col-sm-2 lite-filter">
                    {isLevelUserClient && isGrupNameAdminTraining ? null : 
                      <MultiSelect
                        id="company"
                        options={this.state.optionsCompany}
                        value={this.state.valueCompany}
                        onChange={(valueCompany) => this.changeFilterCompany(valueCompany)}
                        mode="single"
                        enableSearch={true}
                        resetable={true}
                        valuePlaceholder="Filter Company"
                      /> }
                    
                  </div>

                  <div className="float-right col-sm-2 lite-filter">
                    {isLevelUserClient && isGrupNameAdminTraining ? null : 
                      <MultiSelect
                        id="payment"
                        options={this.state.optionsPayment}
                        value={this.state.valuePayment}
                        onChange={(valuePayment) => this.changeFilterPayment(valuePayment)}
                        mode="single"
                        enableSearch={true}
                        resetable={true}
                        valuePlaceholder="Filter Payment"
                      /> }
                    
                  </div>

                  <DataTable
                    columns={DEV_MODE === 'production' ? columns.filter((item)=> item.name !== 'Payment Status') : columns}
                    data={data}
                    highlightOnHover
                    pagination
                    fixedHeader
                    selectableRows={true}
                    contextComponent={<HeaderTable />}
                    onSelectedRowsChange={this.onSelectDataTable}
                    clearSelectedRows={this.state.toggledClearRows}
                  />
                </div>
              </div>
            </div>
          </LoadingOverlay>
          <Modal show={this.state.modalDetail} onHide={this.toogleModal.bind(this, 'modalDetail')} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Detail Account
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ width: 400 }}>
              {Object.keys(this.state.rowSelected).map((input) => {
                return (
                  <>
                    <div className="row">
                      <div className={'col mb-4'}>{this.checkTypeInput(input, this.state.rowSelected[input])}</div>
                    </div>
                  </>
                );
              })}
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btm-icademy-primary btn-icademy-grey"
                onClick={this.toogleModal.bind(this, 'modalDetail')}
              >
                Cancel
              </button>
              <button className="btn btn-icademy-primary" disabled={this.state.isSaving} onClick={this.activateUserBulk.bind(this)}>
                <i className="fa fa-trash"></i> {this.state.isSaving ? 'Activating...' : 'Activate'}
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalRemove} onHide={this.toogleModal.bind(this, 'modalRemove')} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to Remove this user ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btm-icademy-primary btn-icademy-grey"
                onClick={this.toogleModal.bind(this, 'modalRemove')}
              >
                Cancel
              </button>
              <button
                className="btn btn-icademy-primary"
                onClick={this.removeUserBulk.bind(this)}
                disabled={this.state.isSaving}
              >
                <i className="fa fa-trash"></i> {this.state.isSaving ? 'Removing...' : 'Remove'}
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalActivate} onHide={this.toogleModal.bind(this, 'modalActivate')} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to activate this user ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btm-icademy-primary btn-icademy-grey"
                onClick={this.toogleModal.bind(this, 'modalActivate')}
              >
                Cancel
              </button>
              <button
                className="btn btn-icademy-primary"
                onClick={this.activateUserBulk.bind(this)}
                disabled={this.state.isSaving}
              >
                <i className="fa fa-trash"></i> {this.state.isSaving ? 'Activating...' : 'Activate'}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } catch (e) {}
  }
}

export default User;
