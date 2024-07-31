import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { Modal } from 'react-bootstrap';

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filter: '',
      training_company_id: '',
      start: '',
      end: '',
      range1: false,
      range2: false,
      isLoading: false,
      modalDelete: false,
      deleteId: '',
      modalActivate: false,
      activateId: '',
      dataState: true,
      totalRows: null,
      perPage: 10,
      currentPage: 1,
      status: 'Active',
      filterTimeBounds: null,
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  closeModalDelete = (e) => {
    this.setState({ modalDelete: false, deleteId: '' });
  };
  closeModalActivate = (e) => {
    this.setState({ modalActivate: false, activateId: '' });
  };
  onClickHapus(id) {
    this.setState({ modalDelete: true, deleteId: id });
  }
  onClickActivate(id) {
    this.setState({ modalActivate: true, activateId: id });
  }
  delete(id) {
    API.delete(`${API_SERVER}v2/training/membership/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error delete membership');
      } else {
        this.getData(this.state.companyId, this.state.currentPage);
        this.closeModalDelete();
        toast.success('Membership deactivated');
      }
    });
  }

  activate(id) {
    API.put(`${API_SERVER}v2/training/membership-activate/${id}`).then(async (res) => {
      if (res.data.error) {
        toast.error('Error activate membership');
      } else {
        this.closeModalActivate();
        this.getData(this.state.companyId, this.state.currentPage);
        toast.success('Membership activated');
      }
    });
  }

  handleChangeFilter = async (name, e) => {
    await this.setState({ [name]: e, range1: false, range2: false, currentPage: 1 }, () => {
      console.log(null);
    });
    this.getData(this.state.companyId, this.state.currentPage);
  };
  async changeFilterRange(range) {
    if (range === 'range1') {
      await this.setState({
        range1: !this.state.range1,
        range2: false,
        start: !this.state.range1 ? new Date() : '',
        end: !this.state.range1 ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : '',
        currentPage: 1,
      });
      this.getData(this.state.companyId, this.state.currentPage);
    } else if (range === 'range2') {
      await this.setState({
        range2: !this.state.range2,
        range1: false,
        start: !this.state.range2 ? new Date() : '',
        end: !this.state.range2 ? new Date(new Date().setMonth(new Date().getMonth() + 3)) : '',
        currentPage: 1,
      });
      this.getData(this.state.companyId, this.state.currentPage);
    }
  }

  getData(companyId, page = 1) {
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    let sql = '';
    const startDate = this.state.start ? moment(this.state.start).utc().format('YYYY-MM-DD') : '';
    const endDate = this.state.end ? moment(this.state.end).utc().format('YYYY-MM-DD') : '';
    this.setState({ isLoading: true });
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training') {
      sql = `${API_SERVER}v2/training/membership-training/${this.state.training_company_id}/${this.state.status}?page=${page}&show=${this.state.perPage}&keyword=${this.state.filter}&from_date=${startDate}&to_date=${endDate}`;
    } else {
      sql = `${API_SERVER}v2/training/membership-company/${companyId}/${this.state.status}?page=${page}&show=${this.state.perPage}&keyword=${this.state.filter}&from_date=${startDate}&to_date=${endDate}`;
    }
    API.get(sql).then((res) => {
      if (res.data.error) {
        toast.error('Error read membership list');
        this.setState({ isLoading: false });
      } else {
        this.setState({
          data: res.data.result,
          isLoading: false,
          totalRows: res.data.pagination.totalRows,
          perPage: res.data.pagination.perPage,
          currentPage: page,
        });
      }
    });
  }

  getUserData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
          userId: res.data.result.user_id,
        });

        if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training') {
          API.get(`${API_SERVER}v2/training/user/read/user/${Storage.get('user').data.user_id}`).then((res) => {
            if (res.status === 200) {
              this.setState({ training_company_id: res.data.result.training_company_id }, () => {
                this.getData(this.state.companyId);
              });
            }
          });
        } else {
          this.getData(this.state.companyId);
        }
      }
    });
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
  }

  async onChangeStatus(status) {
    await this.setState({ status, dataState: status === 'Active' ? true : false, currentPage: 1 });
    this.getData(this.state.companyId, this.state.currentPage);
  }

  onChangePage(page) {
    this.getData(this.state.companyId, page);
  }

  async onChangeRowsPerPage(perPage, page) {
    await this.setState({ perPage });
    this.getData(this.state.companyId, page);
  }

  componentDidMount() {
    this.getUserData();
    this.renderFilterElement();
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  };

  renderFilterElement() {
    setTimeout(() => {
      const dataTableElement = document.getElementsByClassName('data-table-extensions');
      const div = document.createElement('div');
      div.className = 'data-table-extensions-filter';

      const label = document.createElement('label');
      label.htmlFor = 'filterDataTable';
      label.className = 'icon';

      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'filterDataTable';
      input.id = 'filterDataTable';
      input.className = 'filter-text';
      input.placeholder = 'Filter Data';
      input.autocomplete = 'off';
      div.append(label, input);
      dataTableElement[0].appendChild(div);

      const inputFilter = document.getElementById('filterDataTable');
      inputFilter.addEventListener('input', async (e) => {
        clearTimeout(this.state.filterTimeBounds);

        const timeBounds = setTimeout(async () => {
          await this.setState({ filter: e.target.value, currentPage: 1 });
          this.getData(this.state.companyId, this.state.currentPage);
        }, 500);

        this.setState({ filterTimeBounds: timeBounds });
      });
    }, 1000);
  }

  render() {
    const columns = [
      {
        name: 'Member Card',
        selector: 'license_card',
        sortable: true,
        cell: (row) => (
          <a href={row.license_card} target="_blank">
            <img
              height="36px"
              alt="License Card"
              src={row.license_card ? row.license_card : 'assets/images/no-image.png'}
            />
          </a>
        ),
        cellExport: (row) => row.license_card,
      },
      {
        cell: (row) => <Link to={'/training/membership/edit/' + row.id}>{row.license_number}</Link>,
        name: 'License Number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cellExport: (row) => row.license_number,
        minWidth: '224px',
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
        maxWidth: '180px',
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
        cell: (row) => moment.tz(row.expired, moment.tz.guess(true)).format('DD-MM-YYYY'),
        name: 'Expiration Date',
        selector: 'expired',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: (row) =>
          row.submission_time === null
            ? '-'
            : moment.tz(row.submission_time, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm'),
        name: 'Submission Time',
        selector: 'submission_time',
        sortable: true,
        minWidth: '150px',
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: (row) => (
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              if (eventKey === 1) {
                this.props.history.push('/training/membership/edit/' + row.id);
              } else if (eventKey === 2) {
                this.onClickHapus(row.id);
              } else if (eventKey === 3) {
                this.onClickActivate(row.id);
              }
            }}
          >
            <Dropdown.Toggle btnStyle="flat" noCaret iconOnly>
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={1} data-id={row.id}>
                <i className="fa fa-edit" /> Edit
              </MenuItem>
              {this.state.dataState ? (
                <MenuItem eventKey={2} data-id={row.id}>
                  <i className="fa fa-trash" /> Deactivate
                </MenuItem>
              ) : null}
              {!this.state.dataState ? (
                <MenuItem eventKey={3} data-id={row.id}>
                  <i className="fa fa-save" /> Activate
                </MenuItem>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        ),
        allowOverflow: true,
        button: true,
        width: '56px',
        cellExport: (row) => ({}),
      },
    ];
    const ExpanableComponent = ({ data }) => (
      <table className="expandTable">
        <tr>
          <td rowspan="6">License Card</td>
          <td rowspan="6">:</td>
          <td rowspan="6">
            <a href={data.license_card} target="_blank">
              <img
                height="100px"
                alt={data.license_number}
                src={data.license_card ? data.license_card : 'assets/images/no-image.png'}
              />
            </a>
          </td>
        </tr>
        <tr>
          <td>License Number</td>
          <td>:</td>
          <td>{data.license_number}</td>
        </tr>
        <tr>
          <td>Expiration Date</td>
          <td>:</td>
          <td>{moment.tz(data.expired, moment.tz.guess(true)).format('DD-MM-YYYY')}</td>
        </tr>
        <tr>
          <td>Submission Time</td>
          <td>:</td>
          <td>
            {data.submission_time === null
              ? '-'
              : moment.tz(data.submission_time, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm')}
          </td>
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
    let { data } = this.state;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="floating-back">
                    <img src={`newasset/back-button.svg`} alt="" width={90} onClick={this.goBack}></img>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <TabMenu title="Training" selected="Membership" />
                      <div>
                        <div className="card p-20 main-tab-container">
                          <div className="row">
                            <div className="col-sm-12 m-b-20">
                              <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                                Filter
                              </strong>
                              <div className="form-section no-border">
                                <div className="row">
                                  <div className="form-field-top-label">
                                    <label for="start">Expiration Start Date</label>
                                    <DatePicker
                                      dateFormat="dd-MM-yyyy"
                                      selected={this.state.start}
                                      onChange={(e) => this.handleChangeFilter('start', e)}
                                    />
                                  </div>
                                  <div className="form-field-top-label">
                                    <label for="end">Expiration End Date</label>
                                    <DatePicker
                                      dateFormat="dd-MM-yyyy"
                                      selected={this.state.end}
                                      onChange={(e) => this.handleChangeFilter('end', e)}
                                    />
                                  </div>
                                  <div className="form-field-top-label">
                                    <label>&nbsp;</label>
                                    <div
                                      className={`filter-button ${this.state.range1 && 'filter-button-selected'}`}
                                      onClick={this.changeFilterRange.bind(this, 'range1')}
                                    >
                                      Expires in a month
                                    </div>
                                  </div>
                                  <div className="form-field-top-label">
                                    <label>&nbsp;</label>
                                    <div
                                      className={`filter-button ${this.state.range2 && 'filter-button-selected'}`}
                                      onClick={this.changeFilterRange.bind(this, 'range2')}
                                    >
                                      Expires in 3 months
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <LoadingOverlay
                          active={this.state.isLoading}
                          spinner={<BeatLoader size="30" color="#008ae6" />}
                        >
                          <div className="card p-20 main-tab-container">
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                                <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                                  Membership List
                                </strong>
                                <div
                                  class={`text-menu ${!this.state.dataState && 'active'}`}
                                  style={{ clear: 'both' }}
                                  onClick={this.onChangeStatus.bind(this, 'Inactive', false)}
                                >
                                  Inactive
                                </div>
                                <div
                                  class={`text-menu ${this.state.dataState && 'active'}`}
                                  onClick={this.onChangeStatus.bind(this, 'Active', true)}
                                >
                                  Active
                                </div>
                                {/* <div className="data-table-extensions">
                                  
                                </div> */}
                                <DataTableExtensions
                                  print={false}
                                  filter={false}
                                  export
                                  exportHeaders
                                  columns={columns}
                                  data={data}
                                  filterPlaceholder="Filter Data"
                                >
                                  <DataTable
                                    columns={columns}
                                    data={data}
                                    highlightOnHover
                                    pagination
                                    paginationServer
                                    paginationTotalRows={this.state.totalRows}
                                    onChangeRowsPerPage={(perPage, page) => this.onChangeRowsPerPage(perPage, page)}
                                    onChangePage={(page) => this.onChangePage(page)}
                                    paginationDefaultPage={this.state.currentPage}
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
        <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure want to deactivate this membership ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
              Cancel
            </button>
            <button
              className="btn btn-icademy-primary btn-icademy-red"
              onClick={this.delete.bind(this, this.state.deleteId)}
            >
              <i className="fa fa-trash"></i> Deactivate
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
            <div>Are you sure want to activate this membership ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalActivate.bind(this)}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary" onClick={this.activate.bind(this, this.state.activateId)}>
              <i className="fa fa-trash"></i> Activate
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Membership;
