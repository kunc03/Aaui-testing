import React, { Component } from "react";
import TabMenu from '../../tab_menu/route';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import Quota from '../quota/detail';
import { MultiSelect } from 'react-sm-select';

class SettingsTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: '',
        companyId: '',
        image:'',
        imagePreview: API_SERVER+'training/membership/card.svg',
        logoOrganizerPreview: API_SERVER+'training/membership/card.svg',
        logoOrganizer: '',
        nameOrganizer: '',
        idOrganizer:'',
        optionLicenseType: [],
        opOrganizer:[],
        data: [],
        dataOrganizer: [],
        modalCreateOrganizer:false,
        modalDeleteOrginazer:false,
        modalCreate: false,
        modalDelete: false,
        modalOther: false,
        showOrganizer: true,
        typeName: '',
        duration: 2,
        req_license_type: '',
        license_format: '[YYYY][MM][DD].A0[GENDER]-[NUMBER]',
        typeId:'',
        dataOthers :
        [
          {
            id: 0,
            setting: 'License Number Format',
            value: '',
            placeholder: '[YYYY][MM][DD].A0[GENDER]-[NUMBER]',
            default: '[YYYY][MM][DD].A0[GENDER]-[NUMBER]'
          }
        ],
        otherSettingActive: '',
        otherSettingActiveValue: '',
        isSaving: false
    };
  }

  closeModalCreate = e => {
    this.setState({ idOrganizer:'',nameOrganizer:'',modalCreate: false, typeName: '', typeId: '', imagePreview : API_SERVER+'training/membership/card.svg', image: '' })
  }
  closeModalCreateOrganizer = e =>{
    this.setState({ modalCreateOrganizer: false,logoOrganizer:'', nameOrganizer: '', idOrganizer: '', imagePreview : API_SERVER+'training/membership/card.svg', imageOrganizer: '' })
  }
  closeModalDelete = e => {
    this.setState({ modalDelete: false, typeId: '' })
  }
  closeModalDeleteOrganizer = e => {
    this.setState({ modalDeleteOrginazer: false, idOrganizer: '' })
  }
  closeModalOther = e => {
    this.setState({ modalOther: false })
  }

  goTo(url) {
    if (url === 'back'){
      this.props.history.goBack();
    }
    else{
      this.props.history.push(url);
    }
  }

  handleChangeLogoOrganizer = e => {
    let {name, value} = e.target;
    if (name==='image' || name === 'imageOrganizer'){
      if (e.target.files.length){
          if (e.target.files[0].size <= 5000000) {
              let logoOrganizer = {
                  logoOrganizer: e.target.files[0],
                  logoOrganizerPreview: URL.createObjectURL(e.target.files[0])
              }
              this.setState(logoOrganizer)
          } else {
            value = null;
            toast.warning('Image size cannot larger than 5MB and must be an image file')
          }
      }
    }
  }

  handleChange = e => {
    let {name, value} = e.target;
    if (name==='image'){
      if (e.target.files.length){
          if (e.target.files[0].size <= 5000000) {
              let image = {
                  image: e.target.files[0],
                  imagePreview: URL.createObjectURL(e.target.files[0])
              }
              this.setState(image)
          } else {
            e.target.value = null;
            toast.warning('Image size cannot larger than 5MB and must be an image file')
          }
      }
    }
    else{
      this.setState({[name]: value})
    }
}

  save(){
      if (this.state.typeName === ''){
          toast.warning('Please fill License Type Name')
      }
      else{
        this.setState({isSaving: true});
          if (this.state.typeId === ''){
            let form = {
                company_id: this.state.companyId,
                name : this.state.typeName,
                organizer_id: this.state.idOrganizer,
                duration: this.state.duration,
                req_license_type: this.state.req_license_type,
                license_format: this.state.license_format
            }
            API.post(`${API_SERVER}v2/training/settings/licenses-type`, form).then(res => {
                if (res.data.error){
                  this.setState({isSaving: false})
                    toast.error(`Error create licenses type`)
                }
                else{

                  if (this.state.image){
                      let formData = new FormData();
                      formData.append("image", this.state.image)
                      API.put(`${API_SERVER}v2/training/settings/licenses-type/image/${res.data.result.insertId}`, formData).then(res2 => {
                          if (res2.data.error){
                              toast.warning(`Licenses type edited but fail to upload image`)
                          }
                          else{
                            this.setState({isSaving: false});
                            toast.success(`New licenses type created`)
                            this.closeModalCreate();
                            this.getLicensesType(this.state.companyId)
                          }
                      })
                  }
                  else{
                    this.setState({isSaving: false});
                    toast.success(`New licenses type created`)
                    this.closeModalCreate();
                    this.getLicensesType(this.state.companyId)
                  }
                }
            })
          }
          else{
            let form = {
                id: this.state.typeId,
                name : this.state.typeName,
                organizer_id: this.state.idOrganizer,
                duration: this.state.duration,
                req_license_type: this.state.req_license_type,
                license_format: this.state.license_format
            }
            API.put(`${API_SERVER}v2/training/settings/licenses-type`, form).then(res => {
                if (res.data.error){
                  this.setState({isSaving: false})
                  toast.error(`Error edit licenses type`)
                }
                else{

                  if (this.state.image){
                      let formData = new FormData();
                      formData.append("image", this.state.image)
                      API.put(`${API_SERVER}v2/training/settings/licenses-type/image/${form.id}`, formData).then(res2 => {
                          if (res2.data.error){
                              toast.warning(`Licenses type edited but fail to upload image`)
                          }
                          else{
                            this.setState({isSaving: false});
                            toast.success(`Licenses type edited`)
                            this.closeModalCreate();
                            this.getLicensesType(this.state.companyId)
                          }
                      })
                  }
                  else{
                    this.setState({isSaving: false});
                    toast.success(`Licenses type edited`)
                    this.closeModalCreate();
                    this.getLicensesType(this.state.companyId)
                  }
                }
            })
          }
      }
  }

  saveOrganizer(){
    if (this.state.nameOrganizer === ''){
        toast.warning('Please fill organizer name')
    }
    else{
      this.setState({isSaving: true});
      let msg = '';
      let sqlQuery = `${API_SERVER}v2/training/settings/organizer/`;
      let action = null;
      let formData = new FormData();

      formData.append("company_id", this.state.companyId);
      formData.append("name", this.state.nameOrganizer);
      formData.append("image", this.state.logoOrganizer);

      if (this.state.idOrganizer === ''){
        msg = 'create';
        action = API.post;
        sqlQuery += this.state.companyId;
      }
      else{
        msg = 'edit'
        action = API.put;
        sqlQuery += this.state.idOrganizer;
      }

      action(sqlQuery, formData).then(res => {
        if (res.data.error){
          this.setState({isSaving: false})
            toast.error(`Error ${msg} organizer`)
        }
        else{
          this.setState({isSaving: false, logoOrganizer:false, nameOrganizer:'', idOrganizer:''});
          this.closeModalCreateOrganizer();
          this.getOrganizer(this.state.companyId);
          toast.success(`Success ${msg} organizer`);
        }
      })
    }
}

  saveOther(){
    if (this.state.otherSettingActive === 0){
      let form = {
          format : this.state.otherSettingActiveValue
      }
      API.put(`${API_SERVER}v2/training/settings/license-format/${this.state.companyId}`, form).then(res => {
        if (res.data.error){
            toast.error(`Error save licenses format`);
        }
        else{
            toast.success(`Licenses format saved`);
            this.getLicensesFormat(this.state.companyId);
            this.closeModalOther();
        }
      })
    }
  }
  
  delete(id, type){
    if(type === 'organizer') {
      API.delete(`${API_SERVER}v2/training/settings/organizer/${id}`).then(res => {
        if (res.data.error){
            toast.error(res.data.result);
        }
        else{
            toast.success(`Licenses type deleted`)
            this.closeModalDeleteOrganizer();
            this.getOrganizer(this.state.companyId)
        }
      })
    }else{
      API.delete(`${API_SERVER}v2/training/settings/licenses-type/${id}`).then(res => {
        if (res.data.error){
          toast.error(res.data.result);
        }
        else{
            toast.success(`Licenses type deleted`)
            this.closeModalDelete();
            this.getLicensesType(this.state.companyId)
        }
      })
    }
}

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
            this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
            this.getOrganizer(this.state.companyId)
            this.getLicensesFormat(this.state.companyId)
        }
    })
  }

  getOrganizer(company_id){
    API.get(`${API_SERVER}v2/training/settings/organizer/${company_id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses type`)
        }
        else{
          let opOrganizer = [];
          if(res.data.result.length){
            res.data.result.forEach((str)=>{
              opOrganizer.push({ label:str.name, value:str.id });
            });
          }
          this.setState({dataOrganizer: res.data.result, opOrganizer});
          this.getLicensesType(this.state.companyId);
        }
    })
  }

  getLicensesType(company_id){
    API.get(`${API_SERVER}v2/training/settings/licenses-type/${company_id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses type`)
        }
        else{
            let tmp = [];
            let optionLicenseType = [];
            if(res.data.result.length){
              let data = res.data.result;
              let organizer = this.state.dataOrganizer;
              data.forEach((item)=>{
                if(item.organizer_id){
                  let idx = organizer.findIndex((org)=>{ return org.id == item.organizer_id });
                  if(idx > -1){
                    item.nameOrganizer = organizer[idx].name;
                  }
                }else{
                  item.nameOrganizer = '';
                }
                optionLicenseType.push({label: item.organizer_name+' - '+item.name, value: item.id});
                tmp.push(item);
              });
            }
            this.setState({data: tmp, optionLicenseType: optionLicenseType})
        }
    })
  }

  getLicensesFormat(company_id){
    API.get(`${API_SERVER}v2/training/settings/license-format/${company_id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses format`)
        }
        else{
            if (res.data.result){
              let otherSetting = this.state.dataOthers;
              otherSetting[0].value = res.data.result.format;
              this.setState({ otherSetting })
            }
            else{
              this.setState({licenseFormat: ''})
            }
        }
    })
  }

  componentDidMount(){
      this.getUserData();
  }

  render() {
    const columnsOrganizer = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.setState({modalCreateOrganizer: true,logoOrganizer:row.logo, logoOrganizerPreview: !row.logo ? this.state.logoOrganizerPreview : row.logo , idOrganizer: row.id, nameOrganizer: row.name});break;
                default : this.setState({modalDeleteOrginazer: true, idOrganizer: row.id});break;
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
      }
    ];
    const columns = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true
      },
      {
        name: 'Organizer',
        selector: 'nameOrganizer'
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.setState({modalCreate: true ,req_license_type: row.required_license_type, typeId: row.id, typeName: row.name, imagePreview: row.image_card.length ? row.image_card : this.state.imagePreview, idOrganizer:row.organizer_id, nameOrganizer:row.organizer_name});break;
                default : this.setState({modalDelete: true, typeId: row.id});break;
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
      }
    ];

    const columnsOthers =
    [
      {
        name: 'Setting',
        selector: 'setting',
        sortable: true
      },
      {
        name: 'Value',
        selector: 'value',
        cell: row => row.value.length ? row.value : row.default,
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
                case 1 : this.setState({modalOther: true, otherSettingActive: row.id, otherSettingActiveValue: row.value.length ? row.value : row.default});break;
                default : this.setState({modalOther: true, otherSettingActive: row.id, otherSettingActiveValue: row.value});break;
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
              <MenuItem eventKey={1}><i className="fa fa-edit" /> Edit</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      }
    ];
    let {data, dataOthers, dataOrganizer} = this.state;
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
                                    onClick={this.goTo.bind(this, 'back')}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <TabMenu title='Training' selected='Settings'/>
                                        <div className="card p-20 main-tab-container">
                                            <div className="row">
                                                <div className="col-sm-12 m-b-20">
                                                    <strong className="f-w-bold f-18" style={{color:'#000'}}>Organizer</strong>
                                                        <button
                                                        onClick={()=> this.setState({modalCreateOrganizer: true})}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                            <i className="fa fa-plus"></i>
                                                            Create New
                                                        </button>
                                                    <input
                                                        type="text"
                                                        placeholder="Search"
                                                        onChange={this.filter}
                                                        className="form-control float-right col-sm-3"/>
                                                        <DataTable
                                                            columns={columnsOrganizer}
                                                            data={dataOrganizer}
                                                            highlightOnHover
                                                            defaultSortField="name"
                                                            pagination
                                                            fixedHeader
                                                            noDataComponent="There are no list organizer."
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card p-20 main-tab-container">
                                            <div className="row">
                                                <div className="col-sm-12 m-b-20">
                                                    <strong className="f-w-bold f-18" style={{color:'#000'}}>Licenses Type</strong>
                                                        <button
                                                        onClick={()=> this.setState({modalCreate: true})}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                            <i className="fa fa-plus"></i>
                                                            Create New
                                                        </button>
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
                                                            noDataComponent="There are no licenses type. Please create the licenses type."
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card p-20 main-tab-container">
                                            <div className="row">
                                                <div className="col-sm-12 m-b-20">
                                                    <strong className="f-w-bold f-18" style={{color:'#000'}}>Other Settings</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 m-b-20">
                                                        <DataTable
                                                            columns={columnsOthers}
                                                            data={dataOthers}
                                                            highlightOnHover
                                                            defaultSortField="name"
                                                            pagination
                                                            fixedHeader
                                                            noDataComponent="There are no licenses type. Please create the licenses type."
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                  this.state.companyId &&
                                  <Quota id={this.state.companyId} lockEdit={true}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          <Modal show={this.state.modalDeleteOrginazer} onHide={this.closeModalDeleteOrganizer} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this organizer ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDeleteOrganizer.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.idOrganizer, 'organizer')}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalOther} onHide={this.closeModalOther} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Settings
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                  this.state.modalOther && this.state.dataOthers[this.state.otherSettingActive].setting === 'License Number Format' ?
                  <div className="form-field-top-label">
                    <p>
                    License Number Format is used for numbering settings and is applied to the entire company. You can change numbering settings anytime with the consequences of changing numbering settings for the entire company.
                    </p>                             
                  </div>
                  : null
                }
                <div className="form-field-top-label">
                    <label for="typeName">{this.state.modalOther ? this.state.dataOthers[this.state.otherSettingActive].setting : null}</label>
                    <input
                    type="text"
                    name="otherSettingActiveValue"
                    size="50"
                    id="otherSettingActiveValue"
                    placeholder={this.state.modalOther ? this.state.dataOthers[this.state.otherSettingActive].placeholder : null}
                    value={this.state.otherSettingActiveValue}
                    onChange={this.handleChange}/>
                </div>
                {
                  this.state.modalOther && this.state.dataOthers[this.state.otherSettingActive].setting === 'License Number Format' ?
                  <div className="form-field-top-label">
                    <label for="licenseFormat">Notes</label>
                    <table className="table-note-settings" style={{clear:'both'}}>
                      <tr>
                        <td>Default Format</td>
                        <td>:</td>
                        <td>[YYYY][MM][DD].A0[GENDER]-[NUMBER]</td>
                      </tr>
                      <tr>
                        <td>Example</td>
                        <td>:</td>
                        <td>20210525.A01-000000001</td>
                      </tr>
                    </table>
                    <table className="table-note-settings" style={{clear:'both'}} border="1">
                      <tr>
                        <th colspan="3">Available Formats</th>
                      </tr>
                      <tr>
                        <th>Format</th>
                        <th>Example</th>
                        <th>Description</th>
                      </tr>
                      <tr>
                        <td>[YYYY]</td>
                        <td>2021</td>
                        <td>Year</td>
                      </tr>
                      <tr>
                        <td>[MM]</td>
                        <td>05</td>
                        <td>Month</td>
                      </tr>
                      <tr>
                        <td>[DD]</td>
                        <td>25</td>
                        <td>Day</td>
                      </tr>
                      <tr>
                        <td>[GENDER]</td>
                        <td>1</td>
                        <td>Gender, 1 for male and 0 for female</td>
                      </tr>
                      <tr>
                        <td>[NUMBER]</td>
                        <td>000000001</td>
                        <td>9 digits increment numbers of the day and by gender</td>
                      </tr>
                    </table>                              
                  </div>
                  : null
                }
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalOther.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.saveOther.bind(this)}>
                <i className="fa fa-save"></i> Save
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalCreate} size={"lg"} onHide={this.closeModalCreate} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                {this.state.typeId !== '' ? 'Edit' : 'Create New'} Licenses Type
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-field-top-label">
                    <label for="typeName">Licenses Type Name<required>*</required></label>
                    <input type="text" name="typeName" size="50" id="typeName" placeholder="Example : Main Exam" value={this.state.typeName} onChange={this.handleChange}/>
                </div>

                <div className="form-field-top-label">
                    <label for="typeName">Duration of Licenses (In a Years)<required>*</required></label>
                    <input type="text" name="duration" size="50" id="duration" placeholder="Example : Main Exam" value={this.state.duration} onChange={this.handleChange}/>
                </div>

                <div className="form-field-top-label">
                    <label for="typeName">Licenses Format</label>
                    <input type="text" name="license_format" size="50" id="license_format" placeholder="Example : [YYYY][MM][DD].A0[GENDER]-[NUMBER]" value={this.state.license_format} onChange={this.handleChange}/>
                    <required>Must Have YYYY MM DD GENDER NUMBER</required>
                </div>

                <div className="form-field-top-label" style={{ width:"380px" }}>
                    <label for="typeName">Required License Type<required>*</required></label>
                    <MultiSelect id="optionLicenseType"  options={this.state.optionLicenseType} value={[this.state.req_license_type]} onChange={options => this.setState({ req_license_type:options[0]})} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Required License Type"/>

                </div>

                <div className="form-field-top-label" style={{ width:"380px" }}>
                    <label for="typeName">Organizer (Additional)<required>*</required></label>
                    <MultiSelect id="opOrganizer" options={this.state.opOrganizer} value={[this.state.idOrganizer]} onChange={options => this.setState({ idOrganizer:options[0]})} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Organizer"/>
                </div>
                <div className="form-field-top-label">
                  <label for="image">Member Card Background</label>
                  <label for="image" style={{cursor:'pointer', overflow:'hidden'}}>
                    <img src={this.state.imagePreview} height="140px" />
                  </label>
                  <label for='image' style={{cursor:'pointer', overflow:'hidden'}}>
                    <div className="button-bordered-grey">
                        {this.state.image ? this.state.image.name : 'Choose'}
                    </div>
                  </label>
                  <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalCreate.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.save.bind(this)} disabled={this.state.isSaving}>
                <i className="fa fa-save"></i> {this.state.isSaving ? 'Saving...' : 'Save'}
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this licenses type ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.typeId)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.modalCreateOrganizer} onHide={this.closeModalCreateOrganizer} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                {this.state.typeId !== '' ? 'Edit' : 'Create New'} Organizer
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-field-top-label">
                    <label for="nameOrganizer">Name<required>*</required></label>
                    <input type="text" name="nameOrganizer" size="50" id="nameOrganizer" placeholder="Example : Organizer Title" value={this.state.nameOrganizer} onChange={this.handleChange}/>
                </div>
                <div className="form-field-top-label">
                  <label for="imageOrganizer">Logo</label>
                  {
                    this.state.logoOrganizer &&
                    (
                      <label for="imageOrganizer" style={{cursor:'pointer', overflow:'hidden'}}>
                        <img src={this.state.logoOrganizerPreview} height="140px" alt="logo-organizer" />
                      </label>
                    )
                  }
                </div>
                <div className="form-field-top-label">
                    <label for="logo-previewOrganizer" style={{cursor:'pointer', overflow:'hidden'}}>
                      <div className="button-bordered-grey">
                          Choose
                      </div>
                    </label>
                    <input type="file" accept="image/*" name="imageOrganizer" id="logo-previewOrganizer" onChange={this.handleChangeLogoOrganizer} disabled={this.state.disabledForm}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalCreateOrganizer.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.saveOrganizer.bind(this)} disabled={this.state.isSaving}>
                <i className="fa fa-save"></i> {this.state.isSaving ? 'Saving...' : 'Save'}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default SettingsTraining;
