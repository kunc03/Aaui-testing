import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ReactSelect from 'react-select';
import moment from 'moment-timezone';
import { Modal } from 'react-bootstrap';
import Storage from '../../../repository/storage';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import './form.css';

class FormUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idNumber: null,
      province: [],
      cities: [],
      district: null,
      subDistrict: null,
      //address
      rw: null,
      rt: null,
      selectedProvince: null,
      selectedCity: null,
      selectedDistrict: null,
      selectedSubDistrict: null,
      //current
      currentRw: null,
      currentRt: null,
      selectedCurrentProvince: null,
      selectedCurrentCity: null,
      selectedCurrentDistrict: null,
      selectedCurrentSubDistrict: null,
      image: '',
      imagePreview: 'assets/images/no-profile-picture.jpg',
      imageIdentity: '',
      imageIdentityPreview: 'assets/images/no-image.png',
      training_company_id: '',
      name: '',
      born_place: '',
      born_date: '',
      gender: '',
      identity: '',
      tin: '',
      address: '',
      currentAddress: '',
      city: '',
      phone: '',
      email: '',
      level: '',
      license_number: '',
      expired: null,
      license_no: '',
      license_date: null,
      optionCompany: [],
      companyId: '',
      modalPassword: false,
      newPassword: '',
      history: [],
      disabledForm: this.props.disabledForm && this.props.id,
      isSaving: false,
      switchButtonAddressSame: false,
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    if (this.props.goBack) {
      this.props.goBack();
    } else {
      this.props.history.goBack();
    }
  }

  changePassword = (e) => {
    this.setState({ isSaving: true });
    if (!this.state.newPassword) {
      toast.warning('Insert the new password');
    } else {
      let form = {
        training_user_id: this.props.id,
        password: this.state.newPassword,
      };
      API.put(`${API_SERVER}v2/training/user-password`, form).then((res) => {
        if (res.data.error) {
          toast.error(`Error change password`);
          this.setState({ isSaving: false });
        } else {
          toast.success(`Success change user's password`);
          this.setState({ isSaving: false });
          this.closeModalPassword();
        }
      });
    }
  };
  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  save = (e) => {
    this.setState({ isSaving: true });
    e.preventDefault();
    if (
      !this.validateEmail(this.state.email) ||
      (!this.props.match.params.id && !this.state.expired && this.state.license_number) ||
      !this.state.name ||
      !this.state.born_date ||
      !this.state.gender ||
      !this.state.address ||
      !this.state.currentAddress ||
      !this.state.selectedProvince ||
      !this.state.selectedCurrentProvince ||
      !this.state.selectedCity ||
      !this.state.selectedCurrentCity ||
      !this.state.selectedDistrict ||
      !this.state.selectedCurrentDistrict ||
      !this.state.selectedSubDistrict ||
      !this.state.selectedCurrentSubDistrict ||
      !this.state.rt ||
      !this.state.currentRt ||
      !this.state.rw ||
      !this.state.currentRw ||
      !this.state.phone ||
      !this.state.email ||
      !this.state.training_company_id
    ) {
      toast.warning('Some field is required or not in their format, please check your data.');
      this.setState({ isSaving: false });
    } else {
      if (this.props.match.params.id) {
        let form = {
          image: this.state.image,
          training_company_id: parseInt(this.state.training_company_id),
          name: this.state.name,
          born_place: this.state.born_place,
          born_date: this.state.born_date,
          gender: this.state.gender,
          identity: this.state.identity,
          tin: this.state.tin,
          license_number: this.state.license_number,
          license_expired: !this.state.expired ? null : this.state.expired,
          license_no: this.state.license_no,
          license_date: !this.state.license_date ? null : this.state.license_date,
          address: this.state.address,
          currentAddress: this.state.currentAddress,
          province: this.state.selectedProvince.label,
          currentprovince: this.state.selectedCurrentProvince.label,
          city: this.state.selectedCity.label,
          currentCity: this.state.selectedCurrentCity.label,
          district: this.state.selectedDistrict,
          currentDistrict: this.state.selectedCurrentDistrict,
          subDistrict: this.state.selectedSubDistrict,
          currentSubDistrict: this.state.selectedCurrentSubDistrict,
          rt: this.state.rt,
          rw: this.state.rw,
          currentRt: this.state.currentRt,
          currentRw: this.state.currentRw,
          phone: this.state.phone,
          email: this.state.email,
          created_by: Storage.get('user').data.user_id,
          tag: this.state.tag,
          auto_fill: this.state.switchButtonAddressSame ? 1 : 0,
        };
        API.put(`${API_SERVER}v2/training/user/${this.props.match.params.id}`, form).then((res) => {
          if (res.data.error) {
            toast.error(`Error edit ${this.state.level} : ${res.data.result}`);
          } else {
            if (this.state.image) {
              this.setState({ isSaving: true });
              let formData = new FormData();
              formData.append('image', this.state.image);
              API.put(`${API_SERVER}v2/training/user/image/${this.props.match.params.id}`, formData).then((res2) => {
                if (res2.data.error) {
                  toast.warning(`${this.state.level} edited but fail to upload image`);
                } else {
                  if (this.state.imageIdentity) {
                    this.setState({ isSaving: true });
                    let formData = new FormData();
                    formData.append('image', this.state.imageIdentity);
                    API.put(
                      `${API_SERVER}v2/training/user/image-identity/${this.props.match.params.id}`,
                      formData,
                    ).then((res2) => {
                      if (res2.data.error) {
                        toast.warning(`${this.state.level} edited but fail to upload identity image`);
                      } else {
                        toast.success(`${this.state.level} edited`);
                        this.setState({ isSaving: false });
                        this.props.history.push(`/training/user/detail/${this.props.match.params.id}`);
                      }
                    });
                  } else {
                    toast.success(`${this.state.level} edited`);
                    this.setState({ isSaving: false });
                    this.props.history.push(`/training/user/detail/${this.props.match.params.id}`);
                  }
                }
              });
            } else {
              if (this.state.imageIdentity) {
                this.setState({ isSaving: true });
                let formData = new FormData();
                formData.append('image', this.state.imageIdentity);
                API.put(`${API_SERVER}v2/training/user/image-identity/${this.props.match.params.id}`, formData).then(
                  (res2) => {
                    if (res2.data.error) {
                      toast.warning(`${this.state.level} edited but fail to upload identity image`);
                    } else {
                      toast.success(`${this.state.level} edited`);
                      this.setState({ isSaving: false });
                      this.props.history.push(`/training/user/detail/${this.props.match.params.id}`);
                    }
                  },
                );
              } else {
                toast.success(`${this.state.level} edited`);
                this.setState({ isSaving: false });
                this.props.history.push(`/training/user/detail/${this.props.match.params.id}`);
              }
            }
          }
        });
      } else {
        let form = {
          training_company_id: parseInt(this.state.training_company_id),
          image: this.state.image,
          name: this.state.name,
          born_place: this.state.born_place,
          born_date: this.state.born_date,
          gender: this.state.gender,
          identity: this.state.identity,
          tin: this.state.tin,
          license_number: this.state.license_number,
          license_expired: !this.state.expired ? null : this.state.expired,
          license_no: this.state.license_no,
          license_date: !this.state.license_date ? null : this.state.license_date,
          address: this.state.address,
          currentAddress: this.state.currentAddress,
          province: this.state.selectedProvince.label,
          currentprovince: this.state.selectedCurrentProvince.label,
          city: this.state.selectedCity.label,
          currentCity: this.state.selectedCurrentCity.label,
          district: this.state.selectedDistrict,
          currentDistrict: this.state.selectedCurrentDistrict,
          subDistrict: this.state.selectedSubDistrict,
          currentSubDistrict: this.state.selectedCurrentSubDistrict,
          rt: this.state.rt,
          rw: this.state.rw,
          currentRt: this.state.currentRt,
          currentRw: this.state.currentRw,
          phone: this.state.phone,
          email: this.state.email,
          level: this.props.match.params.level,
          created_by: Storage.get('user').data.user_id,
          auto_fill: this.state.switchButtonAddressSame ? 1 : 0,
        };
        API.post(`${API_SERVER}v2/training/user`, form).then((res) => {
          if (res.data.error) {
            toast.error(`Error create ${this.state.level} : ${res.data.result}`);
            this.setState({ isSaving: false });
          } else {
            if (this.state.image) {
              this.setState({ isSaving: true });
              let formData = new FormData();
              formData.append('image', this.state.image);
              API.put(`${API_SERVER}v2/training/user/image/${res.data.result.insertId}`, formData).then((res2) => {
                if (res2.data.error) {
                  toast.warning(`${this.state.level} created but fail to upload image`);
                  this.goBack();
                  this.setState({ isSaving: false });
                } else {
                  if (this.state.imageIdentity) {
                    this.setState({ isSaving: true });
                    let formData = new FormData();
                    formData.append('image', this.state.imageIdentity);
                    API.put(`${API_SERVER}v2/training/user/image-identity/${res.data.result.insertId}`, formData).then(
                      (res2) => {
                        if (res2.data.error) {
                          toast.warning(`${this.state.level} created but fail to upload identity image`);
                        } else {
                          toast.success(`${this.state.level} created`);
                          this.setState({ isSaving: false });
                          this.props.history.push(`/training/user/detail/${res.data.result.insertId}`);
                        }
                      },
                    );
                  } else {
                    toast.success(`${this.state.level} created`);
                    this.setState({ isSaving: false });
                    this.props.history.push(`/training/user/detail/${res.data.result.insertId}`);
                  }
                }
              });
            } else {
              if (this.state.imageIdentity) {
                this.setState({ isSaving: true });
                let formData = new FormData();
                formData.append('image', this.state.imageIdentity);
                API.put(`${API_SERVER}v2/training/user/image-identity/${res.data.result.insertId}`, formData).then(
                  (res2) => {
                    if (res2.data.error) {
                      toast.warning(`${this.state.level} edited but fail to upload identity image`);
                    } else {
                      toast.success(`${this.state.level} created`);
                      this.setState({ isSaving: false });
                      this.props.history.push(`/training/user/detail/${res.data.result.insertId}`);
                    }
                  },
                );
              } else {
                toast.success(`${this.state.level} created`);
                this.setState({ isSaving: false });
                this.props.history.push(`/training/user/detail/${res.data.result.insertId}`);
              }
            }
          }
        });
      }
    }
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'image') {
      if (e.target.files.length) {
        if (e.target.files[0].size <= 5000000) {
          this.setState({
            image: e.target.files[0],
            imagePreview: URL.createObjectURL(e.target.files[0]),
          });
        } else {
          e.target.value = null;
          toast.warning('Image size cannot larger than 5MB');
        }
      }
    } else if (name === 'imageIdentity') {
      if (e.target.files.length) {
        if (e.target.files[0].size <= 5000000) {
          this.setState({
            imageIdentity: e.target.files[0],
            imageIdentityPreview: URL.createObjectURL(e.target.files[0]),
          });
        } else {
          e.target.value = null;
          toast.warning('Identity Image size cannot larger than 5MB');
        }
      }
    } else {
      this.setState({ [name]: value });
    }
  };

  getUser(id) {
    API.get(`${API_SERVER}v2/training/user/read/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read user');
      } else {
        this.setState({
          //!address
          selectedProvince: { value: res.data.result.prov_id, label: res.data.result.prov_name },
          selectedCity: { value: res.data.result.city_id, label: res.data.result.city_name },
          selectedDistrict: res.data.result.district,
          selectedSubDistrict: res.data.result.sub_district,
          rt: res.data.result.rt,
          rw: res.data.result.rw,

          //!current address
          currentAddress: res.data.result.current_address,
          selectedCurrentProvince: { label: res.data.result.current_province },
          selectedCurrentCity: { label: res.data.result.current_city },
          selectedCurrentDistrict: res.data.result.current_district,
          selectedCurrentSubDistrict: res.data.result.current_sub_district,
          currentRt: res.data.result.current_rt,
          currentRw: res.data.result.current_rw,

          training_company_id: res.data.result.training_company_id,
          name: res.data.result.name,
          born_place: res.data.result.born_place,
          born_date: res.data.result.born_date,
          gender: res.data.result.gender,
          identity: res.data.result.identity,
          tin: res.data.result.tin,
          license_number: res.data.result.license_number,
          license_no: res.data.result.license_no,
          license_date: res.data.result.license_date,
          expired: res.data.result.license_expired,
          address: res.data.result.address,
          city: res.data.result.city,
          phone: res.data.result.phone,
          email: res.data.result.email,
          imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview,
          imageIdentityPreview: res.data.result.identity_image
            ? res.data.result.identity_image
            : this.state.imageIdentityPreview,
          switchButtonAddressSame: res.data.result.auto_fill,
        });
      }
    });
    this.getHistory(id);
  }
  getHistory(id) {
    API.get(`${API_SERVER}v2/training/user-history/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read history');
      } else {
        this.setState({
          history: res.data.result,
        });
      }
    });
  }

  getUserData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
        });
        this.getCompany(this.state.companyId);
      }
    });
  }

  getCompany(id) {
    API.get(`${API_SERVER}v2/training/company/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read company');
      } else {
        this.setState({ optionCompany: res.data.result });
      }
    });
  }

  closeModalPassword = (e) => {
    this.setState({ modalPassword: false, newPassword: '' });
  };

  fetchProvince = async () => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/provinces`);
      const data = response.data.result.map((item) => ({ value: item.prov_id, label: item.prov_name }));
      this.setState({ province: data });
    } catch (error) {
      console.log(error);
    }
  };

  fetchCities = async (province_id) => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/cities/${province_id}`);
      const data = response.data.result.map((item) => ({ value: item.city_id, label: item.city_name }));
      this.setState({ cities: data });
    } catch (error) {
      console.log(error);
    }
  };

  fetchDistrict = async (cities_id) => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/district/${cities_id}`);
      const data = response.data.result.map((item) => ({ value: item.district_id, label: item.district_name }));
      this.setState({ district: data });
    } catch (error) {
      console.log(error);
    }
  };

  fetchSubDistrict = async (district_id) => {
    try {
      const response = await API.get(`${API_SERVER}v2/training/subdistrict/${district_id}`);
      const data = response.data.result.map((item) => ({ value: item.subDistrict_id, label: item.subDistrict_name }));
      this.setState({ subDistrict: data });
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeProvince = ({ data, current }) => {
    if (current === 'current') {
      this.setState({ selectedCurrentProvince: data, selectedCurrentCity: null, cities: null });
    } else {
      this.setState({ selectedProvince: data, selectedCity: null, cities: null });
    }
  };

  handleChangeCity = ({ data, current }) => {
    if (current === 'current') {
      this.setState({ selectedCurrentCity: data, city: data ? data.label : null });
    } else {
      this.setState({ selectedCity: data, city: data ? data.label : null });
    }
  };

  handleChangeDistrict = ({ data, current }) => {
    if (current === 'current') {
      this.setState({ selectedCurrentDistrict: data, district: data ? data.label : null });
    } else {
      this.setState({ selectedDistrict: data, district: data ? data.label : null });
    }
  };

  handleChangeSubDistrict = ({ data, current }) => {
    if (current === 'current') {
      this.setState({ selectedCurrentSubDistrict: data, subDistrict: data ? data.label : null });
    } else {
      this.setState({ selectedSubDistrict: data, subDistrict: data ? data.label : null });
    }
  };

  handleSwitchButton = () => {
    this.setState((prevState) => {
      const switchButtonAddressSame = !prevState.switchButtonAddressSame;

      let updatedState = {
        switchButtonAddressSame,
      };

      // auto complete toggle button address same
      if (switchButtonAddressSame) {
        updatedState = {
          ...updatedState,
          currentRt: prevState.rt,
          currentRw: prevState.rw,
          currentAddress: prevState.address,
          selectedCurrentProvince: prevState.selectedProvince,
          selectedCurrentCity: prevState.selectedCity,
          selectedCurrentDistrict: prevState.selectedDistrict,
          selectedCurrentSubDistrict: prevState.selectedSubDistrict,
        };
      } else {
        updatedState = {
          ...updatedState,
          currentRt: '',
          currentRw: '',
          currentAddress: '',
          selectedCurrentProvince: null,
          selectedCurrentCity: null,
          selectedCurrentDistrict: '',
          selectedCurrentSubDistrict: '',
        };
      }

      return updatedState;
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedProvince !== this.state.selectedProvince) {
      if (this.state.selectedProvince) {
        this.fetchCities(this.state.selectedProvince.value || null);
      }
    }

    if (prevState.selectedCurrentProvince !== this.state.selectedCurrentProvince) {
      if (this.state.selectedCurrentProvince) {
        this.fetchCities(this.state.selectedCurrentProvince.value || null);
      }
    }
    // fetch district dan sub district
    // if (prevState.selectedCity !== this.state.selectedCity) {
    //   if (this.state.selectedCity) {
    //     this.fetchDistrict(this.state.selectedCity.value);
    //   }
    // }
    // if (prevState.selectedDistrict !== this.state.selectedDistrict) {
    //   if (this.state.selectedDistrict) {
    //     this.fetchSubDistrict(this.state.selectedDistrict.value);
    //   }
    // }
  }

  componentDidMount() {
    this.fetchProvince();
    this.getUserData();
    if (this.props.disabledForm && this.props.id) {
      this.getUser(this.props.id);
    } else if (this.props.match.params.id) {
      this.getUser(this.props.match.params.id);
    }
    this.setState({
      level: this.props.match.params.level ? this.props.match.params.level : 'user',
      training_company_id: this.props.match.params.company !== '0' ? this.props.match.params.company : '',
    });
  }

  render() {
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
                      <div>
                        <div className="card p-20">
                          <div className="row">
                            <div className="col-sm-10 m-b-20">
                              <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                                {this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'}{' '}
                                {this.state.level === 'admin' ? 'Admin' : 'User'}
                              </strong>
                            </div>
                            <div className="col-sm-2 m-b-20">
                              {this.props.disabledForm && (
                                <button
                                  onClick={this.props.goEdit}
                                  className="btn btn-icademy-primary float-right"
                                  style={{ padding: '7px 8px !important', marginRight: 30 }}
                                >
                                  <i className="fa fa-edit"></i>
                                  Edit
                                </button>
                              )}
                              {this.props.disabledForm && (
                                <button
                                  onClick={() => this.setState({ modalPassword: true })}
                                  className="btn btn-icademy-primary float-right"
                                  style={{ padding: '7px 8px !important', marginRight: 30 }}
                                >
                                  <i className="fa fa-key"></i>
                                  Change Password
                                </button>
                              )}
                            </div>
                          </div>
                          {Storage.get('user').data.level === 'client' ? null : (
                            <div className="form-section">
                              <div className="row">
                                <div className="col-sm-12 m-b-20">
                                  <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                    Company
                                  </strong>
                                </div>
                              </div>
                              <div className="row">
                                <div className="form-field-top-label">
                                  <label for="training_company_id">
                                    Company Name<required>*</required>
                                  </label>
                                  <select
                                    name="training_company_id"
                                    value={this.state.training_company_id}
                                    id="training_company_id"
                                    onChange={this.handleChange}
                                    disabled={this.state.disabledForm}
                                  >
                                    <option value="">Select Company</option>
                                    {this.state.optionCompany.map((item) => (
                                      <option value={item.id} selected={this.state.training_company_id === item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="form-section">
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                                <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                  Personal Information
                                </strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="form-field-top-label">
                                <label for="image">Profile Picture</label>
                                <center>
                                  <label style={{ cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}>
                                    <a href={this.state.imagePreview} target="_blank">
                                      <img
                                        src={this.state.imagePreview}
                                        style={{ objectFit: 'cover', width: '54.8px', height: '54.8px' }}
                                      />
                                    </a>
                                  </label>
                                  <label
                                    for="image"
                                    style={{
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      display: this.state.disabledForm ? 'none' : 'block',
                                    }}
                                  >
                                    <div className="button-bordered-grey">
                                      {this.state.image ? this.state.image.name : 'Choose file'}
                                    </div>
                                  </label>
                                </center>
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="image"
                                  id="image"
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="name">
                                  Name<required>*</required>
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  placeholder={!this.state.disabledForm && 'Input Name'}
                                  value={this.state.name}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="born_place">Born Place</label>
                                <input
                                  type="text"
                                  name="born_place"
                                  id="born_place"
                                  placeholder={!this.state.disabledForm && 'Input Born Place'}
                                  value={this.state.born_place}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="born_date">
                                  Born Date<required>*</required>
                                </label>
                                <input
                                  type="date"
                                  name="born_date"
                                  id="born_date"
                                  value={this.state.born_date}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="gender">
                                  Gender<required>*</required>
                                </label>
                                <select
                                  name="gender"
                                  id="gender"
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male" selected={this.state.gender === 'Male'}>
                                    Male
                                  </option>
                                  <option value="Female" selected={this.state.gender === 'Female'}>
                                    Female
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="form-section">
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                                <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                  Identification
                                </strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="form-field-top-label">
                                <label for="imageIdentity">
                                  Identity Card Photo<required>*</required>
                                </label>
                                <center>
                                  <label style={{ cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}>
                                    <a href={this.state.imageIdentityPreview} target="_blank">
                                      <img
                                        src={this.state.imageIdentityPreview}
                                        style={{ objectFit: 'cover', width: '54.8px', height: '54.8px' }}
                                      />
                                    </a>
                                  </label>
                                  <label
                                    for="imageIdentity"
                                    style={{
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      display: this.state.disabledForm ? 'none' : 'block',
                                    }}
                                  >
                                    <div className="button-bordered-grey">
                                      {this.state.imageIdentity ? this.state.imageIdentity.name : 'Choose file'}
                                    </div>
                                  </label>
                                </center>
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="imageIdentity"
                                  id="imageIdentity"
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="identity">
                                  Identity Card Number<required>*</required>
                                </label>
                                <input
                                  type="text"
                                  name="identity"
                                  id="identity"
                                  placeholder={!this.state.disabledForm && 'Input Identity Card Number'}
                                  maxlength="16"
                                  value={this.state.identity}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="tin">Tax Identification Number</label>
                                <input
                                  type="text"
                                  name="tin"
                                  id="tin"
                                  placeholder={!this.state.disabledForm && 'Input Tax Identification Number'}
                                  value={this.state.tin}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="license_number">License Number</label>
                                <input
                                  type="text"
                                  size="30"
                                  name="license_number"
                                  id="license_number"
                                  placeholder={
                                    this.state.disabledForm || this.props.match.params.id
                                      ? ''
                                      : 'Input Certificate Number'
                                  }
                                  value={this.state.license_number}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>

                              {this.state.license_number &&
                                this.state.license_number.length &&
                                !this.props.match.params.id &&
                                !this.state.disabledForm && (
                                  <>
                                    <div className="form-field-top-label">
                                      <label for="expired">
                                        License Expired
                                        <required style={{ fontSize: '11px' }}>
                                          *Required if License Number filled
                                        </required>
                                      </label>
                                      <input
                                        type="date"
                                        name="expired"
                                        id="expired"
                                        style={{ width: '100%' }}
                                        placeholder={'Input Certificate Expired'}
                                        value={this.state.expired}
                                        onChange={this.handleChange}
                                        disabled={this.state.disabledForm}
                                      />
                                    </div>
                                  </>
                                )}

                              {/* <div className="row"> */}
                              <div className="form-field-top-label">
                                <label for="license_no">License No</label>
                                <input
                                  type="text"
                                  size="30"
                                  name="license_no"
                                  id="license_no"
                                  placeholder={
                                    this.state.disabledForm || this.props.match.params.id
                                      ? ''
                                      : 'No SK Agen Asurance from OJK'
                                  }
                                  value={this.state.license_no}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>

                              {this.state.license_no &&
                                this.state.license_no.length &&
                                !this.props.match.params.id &&
                                !this.state.disabledForm && (
                                  <div className="form-field-top-label">
                                    <label for="license_date">
                                      License Date
                                      <required style={{ fontSize: '11px' }}>*Required if License No filled</required>
                                    </label>
                                    <input
                                      type="date"
                                      name="license_date"
                                      id="license_date"
                                      style={{ width: '100%' }}
                                      value={this.state.license_date}
                                      onChange={this.handleChange}
                                      disabled={this.state.disabledForm}
                                    />
                                  </div>
                                )}
                              {/* </div> */}
                            </div>
                          </div>

                          {/* address */}
                          <div className="form-section">
                            <div className="row">
                              <div className="col-sm-6 m-b-20">
                                <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                  Address
                                </strong>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 m-b-20">
                                  <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                    Address is the same as Current Address
                                  </strong>
                                </div>
                                <div className="col-sm-6 m-b-20">
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      onChange={this.handleSwitchButton}
                                      checked={this.state.switchButtonAddressSame}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              {/* address */}
                              <div className="col-sm-6 col-md-6 form-field-top-label">
                                <label for="address">
                                  Address<required>*</required>
                                </label>
                                <textarea
                                  name="address"
                                  rows="3"
                                  cols="60"
                                  id="address"
                                  style={{ width: '100%' }}
                                  placeholder={!this.state.disabledForm && 'Input Address'}
                                  value={this.state.address}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                ></textarea>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="province">
                                    Province<required>*</required>
                                  </label>
                                  <ReactSelect
                                    placeholder="Select Province"
                                    isClearable={true}
                                    value={this.state.selectedProvince}
                                    onChange={(data) =>
                                      this.handleChangeProvince({ data: data, current: 'not-current' })
                                    }
                                    options={this.state.province}
                                    isDisabled={this.state.disabledForm}
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="city">
                                    City<required>*</required>
                                  </label>
                                  <ReactSelect
                                    placeholder="Select City"
                                    isClearable={true}
                                    value={this.state.selectedCity}
                                    onChange={(data) => this.handleChangeCity({ data: data, current: 'not-current' })}
                                    options={this.state.cities}
                                    isDisabled={!this.state.selectedProvince || this.state.disabledForm}
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="selectedDistrict">
                                    District<required>*</required>
                                  </label>
                                  {/* <ReactSelect
                                    placeholder="Select District"
                                    isClearable={true}
                                    value={this.state.District}
                                    onChange={(data) =>
                                      this.handleChangeDistrict({ data: data, current: 'not-current' })
                                    }
                                    options={this.state.district}
                                    isDisabled={!this.state.selectedCity}
                                  /> */}
                                  <input
                                    type="text"
                                    name="selectedDistrict"
                                    id="selectedDistrict"
                                    size="60"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.selectedDistrict}
                                    onChange={this.handleChange}
                                    disabled={!this.state.selectedCity || this.state.disabledForm}
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="selectedSubDistrict">
                                    SubDistrict<required>*</required>
                                  </label>
                                  {/* <ReactSelect
                                    placeholder="Select Ward"
                                    isClearable={true}
                                    value={this.state.selectedSubDistrict}
                                    onChange={(data) => this.handleChangeWard({ data: data, current: 'not-current' })}
                                    options={this.state.subDistrict}
                                    isDisabled={!this.state.selectedDistrict}
                                  /> */}
                                  <input
                                    type="text"
                                    name="selectedSubDistrict"
                                    id="selectedSubDistrict"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.selectedSubDistrict}
                                    onChange={this.handleChange}
                                    disabled={!this.state.selectedDistrict || this.state.disabledForm}
                                  />

                                  <label for="rt" className='mt-3'>
                                    RT<required>*</required>
                                  </label>
                                  <input
                                    type="text"
                                    name="rt"
                                    id="rt"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.rt}
                                    onChange={this.handleChange}
                                    disabled={!this.state.selectedSubDistrict || this.state.disabledForm}
                                  />

                                  <label for="rw" className='mt-3'>
                                    RW<required>*</required>
                                  </label>
                                  <input
                                    type="text"
                                    name="rw"
                                    id="rw"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.rw}
                                    onChange={this.handleChange}
                                    disabled={!this.state.rt || this.state.disabledForm}
                                  />
                                </div>
                              </div>

                              {/* current address */}
                              <div className="col-sm-6 col-md-6 form-field-top-label">
                                <label for="currentAddress">
                                  Current Address<required>*</required>
                                </label>
                                <textarea
                                  name="currentAddress"
                                  rows="3"
                                  cols="60"
                                  id="currentAddress"
                                  style={{ width: '100%' }}
                                  placeholder={!this.state.disabledForm && 'Input Address'}
                                  value={this.state.currentAddress}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm || this.state.switchButtonAddressSame}
                                ></textarea>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="province">
                                    Current Province<required>*</required>
                                  </label>
                                  <ReactSelect
                                    placeholder="Select Province"
                                    isClearable={true}
                                    value={this.state.selectedCurrentProvince}
                                    onChange={(data) => this.handleChangeProvince({ data: data, current: 'current' })}
                                    options={this.state.province}
                                    isDisabled={this.state.disabledForm || this.state.switchButtonAddressSame}
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="city">
                                    Current City<required>*</required>
                                  </label>
                                  <ReactSelect
                                    placeholder="Select City"
                                    isClearable={true}
                                    value={this.state.selectedCurrentCity}
                                    onChange={(data) => this.handleChangeCity({ data: data, current: 'current' })}
                                    options={this.state.cities}
                                    isDisabled={
                                      !this.state.selectedCurrentProvince ||
                                      this.state.disabledForm ||
                                      this.state.switchButtonAddressSame
                                    }
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="district">
                                    Current District<required>*</required>
                                  </label>
                                  {/* <ReactSelect
                                    placeholder="Select District"
                                    isClearable={true}
                                    value={this.state.selectedCurrentDistrict}
                                    onChange={(data) => this.handleChangeDistrict({ data: data, current: 'current' })}
                                    options={this.state.district}
                                    isDisabled={!this.state.selectedCurrentCity}
                                  /> */}

                                  <input
                                    type="text"
                                    name="selectedCurrentDistrict"
                                    id="selectedCurrentDistrict"
                                    size="60"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.selectedCurrentDistrict}
                                    onChange={this.handleChange}
                                    disabled={
                                      !this.state.selectedCurrentCity ||
                                      this.state.disabledForm ||
                                      this.state.switchButtonAddressSame
                                    }
                                  />
                                </div>

                                <div
                                  className="form-field-top-label"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    marginLeft: '-10px',
                                  }}
                                >
                                  <label for="selectedCurrentSubDistrict">
                                    Current SubDistrict<required>*</required>
                                  </label>
                                  {/* <ReactSelect
                                    placeholder="Select Ward"
                                    isClearable={true}
                                    value={this.state.selectedCurrentSubDistrict}
                                    onChange={(data) => this.handleChangeWard({ data: data, current: 'current' })}
                                    options={this.state.subDistrict}
                                    isDisabled={!this.state.selectedCurrentDistrict}
                                  /> */}
                                  <input
                                    type="text"
                                    name="selectedCurrentSubDistrict"
                                    id="selectedCurrentSubDistrict"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.selectedCurrentSubDistrict}
                                    onChange={this.handleChange}
                                    disabled={
                                      !this.state.selectedCurrentDistrict ||
                                      this.state.disabledForm ||
                                      this.state.switchButtonAddressSame
                                    }
                                  />

                                  <label for="currentRt" className='mt-3'>
                                    Current RT<required>*</required>
                                  </label>
                                  <input
                                    type="text"
                                    name="currentRt"
                                    id="currentRt"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.currentRt}
                                    onChange={this.handleChange}
                                    disabled={
                                      !this.state.selectedCurrentSubDistrict ||
                                      this.state.disabledForm ||
                                      this.state.switchButtonAddressSame
                                    }
                                  />

                                  <label for="currentRw" className='mt-3'>
                                    Current RW<required>*</required>
                                  </label>
                                  <input
                                    type="text"
                                    name="currentRw"
                                    id="currentRw"
                                    size="100"
                                    style={{
                                      height: 15,
                                      width: '100%',
                                      borderRadius: 5,
                                      backgroundColor: 'hsl(0, 0%, 95%)',
                                      borderColor: 'hsl(0, 0%, 90%)',
                                    }}
                                    value={this.state.currentRw}
                                    onChange={this.handleChange}
                                    disabled={
                                      !this.state.currentRt ||
                                      this.state.disabledForm ||
                                      this.state.switchButtonAddressSame
                                    }
                                  />

                                </div>
                              </div>

                              {/* <div className="form-field-top-label">
                                                            <label for="street">Street<required>*</required></label>
                                                            <input type="text" name="street" id="street" placeholder="Jl. Pahlawan Seribu"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="province">Province<required>*</required></label>
                                                            <input type="text" name="province" id="province" placeholder="Banten"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="city">City<required>*</required></label>
                                                            <input type="text" name="city" id="city" placeholder="Tangerang"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="district">District</label>
                                                            <input type="text" name="district" id="district" placeholder="Serpong"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="subdistrict">Sub-district</label>
                                                            <input type="text" name="subdistrict" id="subdistrict" placeholder="Lengkong Gudang"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="postal">Postal Code</label>
                                                            <input type="text" name="postal" id="postal" placeholder="15327"/>
                                                        </div> */}
                            </div>
                          </div>

                          <div
                            className={`form-section ${
                              !this.props.disabledForm && this.state.history.length ? 'no-border' : ''
                            }`}
                          >
                            {/* contact */}
                            <div className="row">
                              <div className="col-sm-12 m-b-20">
                                <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                  Contact
                                </strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="form-field-top-label">
                                <label for="phone">
                                  Phone Number<required>*</required>
                                </label>
                                <input
                                  type="number"
                                  name="phone"
                                  id="phone"
                                  placeholder={!this.state.disabledForm && 'Input Phone Number'}
                                  value={this.state.phone}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                              </div>
                              <div className="form-field-top-label">
                                <label for="email">
                                  Email<required>*</required>
                                </label>
                                <input
                                  type="text"
                                  size="50"
                                  name="email"
                                  id="email"
                                  placeholder={!this.state.disabledForm && 'Input Email'}
                                  value={this.state.email}
                                  onChange={this.handleChange}
                                  disabled={this.state.disabledForm}
                                />
                                {/* <label for="phone" style={{marginTop:10}}>By default the password is the same as email<required>*</required></label> */}
                              </div>
                            </div>
                          </div>
                          {this.state.history.length && this.props.disabledForm ? (
                            <div className="form-section no-border">
                              <div className="row">
                                <div className="col-sm-12 m-b-20">
                                  <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                    Company History
                                  </strong>
                                </div>
                              </div>
                              <div className="row">
                                <table className="table-log">
                                  <tr>
                                    <th>Time</th>
                                    <th>Source Company</th>
                                    <th>Destination Company</th>
                                    <th>By</th>
                                  </tr>
                                  {this.state.history.map((item) => {
                                    return (
                                      <tr>
                                        <td>{moment(item.created_at).local().format('DD-MM-YYYY HH:mm')}</td>
                                        <td>{item.source}</td>
                                        <td>{item.destination}</td>
                                        <td>{item.creator}</td>
                                      </tr>
                                    );
                                  })}
                                </table>
                              </div>
                            </div>
                          ) : null}
                          <div className="row" style={{ justifyContent: 'flex-end' }}>
                            {!this.props.disabledForm && (
                              <button
                                onClick={this.save}
                                disabled={this.state.isSaving}
                                className="btn btn-icademy-primary float-right"
                                style={{ padding: '7px 8px !important', marginRight: 30 }}
                              >
                                <i className="fa fa-save"></i>
                                {this.state.isSaving ? 'Saving...' : 'Save'}
                              </button>
                            )}
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
        <Modal show={this.state.modalPassword} onHide={this.closeModalPassword}>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Change Password
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-field-top-label">
              <label for="name">
                New Password<required>*</required>
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={this.state.newPassword}
                onChange={this.handleChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalPassword}>
              Cancel
            </button>
            <button
              className="btn btn-icademy-primary"
              onClick={this.changePassword.bind(this)}
              disabled={this.state.isSaving}
            >
              <i className="fa fa-save"></i> {this.state.isSaving ? 'Saving...' : 'Save'}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default FormUser;
