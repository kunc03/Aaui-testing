import React, { Component } from 'react';
import { Alert, Modal, Form } from 'react-bootstrap';
import API, { USER_ME, USER, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

class Profile extends Component {
  state = {
    user_data: {
      user_id: Storage.get('user').data.user_id,
      company_id: '',
      grup_id: '',
      identity: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      level: '',

      unlimited: '',
      validity: '',
      status: '',

      branch_id: '',
      group: [],
      training_user: [],

      avatar: '',
      tempAvatar: '',

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
      currentAddress: null,
      selectedCurrentProvince: null,
      selectedCurrentCity: null,
      selectedCurrentDistrict: null,
      selectedCurrentSubDistrict: null,
    },

    // options
    province: [],
    cities: [],
    district: [],
    subDistrict: [],
    kursusDiikuti: [],
    isModalAvatar: false,
    toggle_alert: false,

    isUpdateData: false,
    isNotifikasi: false,
    isiNotifikasi: '',
    switchButtonAddressSame: false,
  };

  handleSwitchButton = () => {
    this.setState((prevState) => {
      const switchButtonAddressSame = !prevState.switchButtonAddressSame;
  
      let updatedUserData = { ...prevState.user_data };
  
      if (switchButtonAddressSame) {
        updatedUserData = {
          ...updatedUserData,
          currentRt: prevState.user_data.rt,
          currentRw: prevState.user_data.rw,
          currentAddress: prevState.user_data.address,
          selectedCurrentProvince: prevState.user_data.selectedProvince,
          selectedCurrentCity: prevState.user_data.selectedCity,
          selectedCurrentDistrict: prevState.user_data.selectedDistrict,
          selectedCurrentSubDistrict: prevState.user_data.selectedSubDistrict,
        };
      } else {
        updatedUserData = {
          ...updatedUserData,
          currentRt: '',
          currentRw: '',
          currentAddress: '',
          selectedCurrentProvince: null,
          selectedCurrentCity: null,
          selectedCurrentDistrict: '',
          selectedCurrentSubDistrict: '',
        };
      }
  
      return {
        switchButtonAddressSame,
        user_data: updatedUserData,
      };
    });
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
      this.setState({
        user_data: { ...this.state.user_data, selectedCurrentProvince: data, selectedCurrentCity: null, cities: null },
      });
    } else {
      this.setState({
        user_data: { ...this.state.user_data, selectedProvince: data, selectedCity: null, cities: null },
      });
    }
  };

  handleChangeCity = ({ data, current }) => {
    if (current === 'current') {
      this.setState({
        user_data: { ...this.state.user_data, selectedCurrentCity: data, city: data ? data.label : null },
      });
    } else {
      this.setState({ user_data: { ...this.state.user_data, selectedCity: data, city: data ? data.label : null } });
    }
  };

  handleChangeDistrict = ({ data, current }) => {
    if (current === 'current') {
      this.setState({
        user_data: { ...this.state.user_data, selectedCurrentDistrict: data, district: data ? data.label : null },
      });
    } else {
      this.setState({
        user_data: { ...this.state.user_data, selectedDistrict: data, district: data ? data.label : null },
      });
    }
  };

  handleChangeSubDistrict = ({ data, current }) => {
    if (current === 'current') {
      this.setState({
        user_data: { ...this.state.user_data, selectedCurrentSubDistrict: data, subDistrict: data ? data.label : null },
      });
    } else {
      this.setState({
        user_data: { ...this.state.user_data, selectedSubDistrict: data, subDistrict: data ? data.label : null },
      });
    }
  };

  fetchDataKursusDiikuti() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then((res) => {
      if (res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse() });
      }
    });
  }

  handleModalAvatarClose = (e) => {
    this.setState({
      isModalAvatar: false,
      user_data: { ...this.state.user_data, tempAvatar: '' },
    });
  };

  onClickModalAvatar = (e) => {
    e.preventDefault();
    this.setState({ isModalAvatar: true });
  };

  onClickSubmitModal = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('avatar', this.state.user_data.tempAvatar);
    API.put(`${API_SERVER}v1/user/avatar/${this.state.user_data.user_id}`, formData).then((res) => {
      if (res.status === 200) {
        this.setState({
          user_data: { ...this.state.user_data, avatar: res.data.result },
          isModalAvatar: false,
        });
        window.location.reload();
      }
    });
  };

  onClickSubmitModalDelete = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('avatar', null);
    API.put(`${API_SERVER}v1/user/avatar/${this.state.user_data.user_id}`, formData).then((res) => {
      if (res.status === 200) {
        this.setState({
          user_data: { ...this.state.user_data, avatar: '/assets/images/user/avatar-1.png' },
          isModalAvatar: false,
        });
      }
    });
  };

  fetchProfile = () => {
    const user = Storage.get('user');
    API.get(`${USER_ME}${user.data.email}`).then((res) => {
      if (res.status === 200) {
        if (!res.data.error) {
          const resData = res.data.result.training_user[0];
          if (
            resData && resData.address &&
            resData && resData.current_address &&
            resData && resData.city &&
            resData && resData.current_city &&
            resData && resData.district &&
            resData && resData.current_district &&
            resData && resData.sub_district &&
            resData && resData.current_sub_district &&
            resData && resData.rw &&
            resData && resData.current_rw &&
            resData && resData.rt &&
            resData && resData.current_rt
          ) {
            // const tagSecurity = document.getElementById('security');
            Storage.set('dataAddressCompleted', true);
            Storage.set('isUpdateData', false);
            this.setState({ isUpdateData: false });
            // tagSecurity.click();
            window.location.href = `${window.location.origin}`;
          } else {
            Storage.set('dataAddressCompleted', false);
            if(Storage.get('isUpdateData') === false){
              Storage.set('isUpdateData', false);
            }else{
              Storage.set('isUpdateData', true);
            }
          }
          if(Storage.get('dataAddressCompleted') == false){
            if(Storage.get('isUpdateData') === true){
              this.setState({ isUpdateData: true });
            }
          }
          // console.log('res: ', res.data)
          this.setState({
            ...this.state,
            switchButtonAddressSame: resData && resData.auto_fill || res.data.result.auto_fill,
            user_data: {
              ...this.state.user_data,
              avatar: res.data.result.avatar ? res.data.result.avatar : '/assets/images/user/avatar-1.png',
              company_id: res.data.result.company_id,
              branch_id: res.data.result.branch_id,
              grup_id: res.data.result.grup_id,
              group: res.data.result.group,
              level: res.data.result.level,
              status: res.data.result.status,
              email: res.data.result.email,
              name: res.data.result.name,
              identity: res.data.result.identity,
              address: resData && resData.address || res.data.result.address,
              city: resData && resData.city || res.data.result.city,
              phone: res.data.result.phone,
              unlimited: res.data.result.unlimited,
              validity: res.data.result.validity ? res.data.result.validity.toString().substring(0, 10) : '0000-00-00',
              training_user: res.data.result.training_user,
              //address
              rw: resData && resData.rw || res.data.result.rw,
              rt: resData && resData.rt || res.data.result.rt,
              selectedProvince: { label: resData && resData.province || res.data.result.current_province },
              selectedCity: { label: resData && resData.city || res.data.result.current_city },
              selectedDistrict: resData && resData.district || res.data.result.current_district,
              selectedSubDistrict: resData && resData.sub_district || res.data.result.current_sub_district,
              //current
              currentRw: resData && resData.current_rw || res.data.result.current_rw,
              currentRt: resData && resData.current_rt || res.data.result.current_rt,
              currentAddress: resData && resData.current_address || res.data.result.current_address,
              selectedCurrentProvince: { label: resData && resData.current_province || res.data.result.current_province },
              selectedCurrentCity: { label: resData && resData.current_city || res.data.result.current_city},
              selectedCurrentDistrict: resData && resData.current_district || res.data.result.current_district,
              selectedCurrentSubDistrict: resData && resData.current_sub_district || res.data.result.current_sub_district,
            },
          });
          // if (this.state.user_data.level==='client'){
          // this.setState({user_data:{
          // ...this.state.user_data,
          // level:'user'
          // }})
          // }
        }
      }
    });
  };

  updateProfile = (e) => {
    e.preventDefault();
    const { user_data, switchButtonAddressSame } = this.state;
    if (!user_data.name) return toast.warning('Completed your data name');
    if (!user_data.identity) return toast.warning('Completed your data identity');
    if (!user_data.phone) return toast.warning('Completed your data phone');
    if (!user_data.address) return toast.warning('Completed your data address');
    if (!user_data.currentAddress) return toast.warning('Completed your data current Address');

    if (!user_data.selectedProvince) return toast.warning('Completed your data province');
    if (!user_data.selectedCurrentProvince) return toast.warning('Completed your data current province');

    if (!user_data.selectedCity) return toast.warning('Completed your data city');
    if (!user_data.selectedCurrentCity) return toast.warning('Completed your data current city');

    if (!user_data.selectedDistrict) return toast.warning('Completed your data district');
    if (!user_data.selectedCurrentDistrict) return toast.warning('Completed your data current district');

    if (!user_data.selectedSubDistrict) return toast.warning('Completed your data sub district');
    if (!user_data.selectedCurrentSubDistrict) return toast.warning('Completed your data current sub district');

    if (!user_data.selectedProvince) return toast.warning('Completed your data province');
    if (!user_data.selectedCurrentProvince) return toast.warning('Completed your data current province');
    if (!user_data.selectedCity) return toast.warning('Completed your data city');
    if (!user_data.selectedCurrentCity) return toast.warning('Completed your data current city');

    const data = {
      ...user_data,
      selectedProvince: user_data.selectedProvince.label,
      selectedCity: user_data.selectedCity.label,
      selectedCurrentProvince: user_data.selectedCurrentProvince.label,
      selectedCurrentCity: user_data.selectedCurrentCity.label,
      auto_fill: Boolean(switchButtonAddressSame) ? 1 : 0,
    };
    API.put(`${USER}/${user_data.user_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          if (!res.data.error) {
            this.fetchProfile();
            this.setState({
              ...this.state,
              toggle_alert: true,
              isUpdateData: false,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  closeNotifikasi = (e) => {
    if (e === 'isNotifikasi') {
      this.setState({ isNotifikasi: false, isiNotifikasi: '' });
    } else {
      this.setState({ isUpdateData: false });
      Storage.set('isUpdateData', false);
    }
  };

  handleChange = (e) => {
    if (e.target.name === 'avatar') {
      if (e.target.files[0].size <= 500000) {
        this.setState({
          user_data: { ...this.state.user_data, tempAvatar: e.target.files[0] },
        });
      } else {
        e.target.value = null;
        this.handleModalAvatarClose();
        this.setState({
          isNotifikasi: true,
          isiNotifikasi: 'The file does not match the format, please check again.',
        });
      }
    } else {
      this.setState({
        user_data: {
          ...this.state.user_data,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.user_data.selectedProvince !== this.state.user_data.selectedProvince) {
      if (this.state.user_data.selectedProvince) {
        this.fetchCities(this.state.user_data.selectedProvince.value || null);
      }
    }

    if (prevState.user_data.selectedCurrentProvince !== this.state.user_data.selectedCurrentProvince) {
      if (this.state.user_data.selectedCurrentProvince) {
        this.fetchCities(this.state.user_data.selectedCurrentProvince.value || null);
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
    this.fetchProfile();
    this.fetchProvince();
    this.fetchDataKursusDiikuti();
  }

  render() {
    const { user_data, toggle_alert } = this.state;
    //console.log('state: ', this.state);
    // const ListAktivitas = ({ lists }) => {
    //   if (lists.length !== 0) {
    //     return (
    //       <ol className="p-l-40 p-t-30 p-r-40 p-b-30 ">
    //         {lists.map((item, i) => (
    //           <div key={item.course_id}>
    //             <li className="f-16 f-w-800 text-c-black" style={{margin: '5px 0'}}>
    //               {item.course.title}
    //               <Link to={`/detail-kursus/${item.course_id}`} style={{float: 'right'}}>Lihat</Link>
    //             </li>
    //             <table style={{ width: "100%" }}>
    //               <ListChapters lists={item.chapters} />
    //             </table>
    //           </div>
    //         ))}
    //       </ol>
    //     );
    //   } else {
    //     return (
    //       <h3 className="f-w-900 f-20" style={{ margin: "30px" }}>
    //         Belum ada aktivitas.
    //       </h3>
    //     );
    //   }
    // };

    // const ListChapters = ({ lists }) => (
    //   <tbody>
    //     {lists.map((item, i) => (
    //       <tr key={item.chapter_id}>
    //         <th className>{item.chapter_title}</th>
    //       </tr>
    //     ))}
    //   </tbody>
    // );

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-block">
              <h3 className="f-w-bold f-18 fc-blue">Profile</h3>
              <div className="mt-3 mb-3">
                <img alt="" src={this.state.user_data.avatar} className="rounded-circle img-profile mb-4" />

                <button onClick={this.onClickModalAvatar} className="btn btn-icademy-primary mb-2 ml-3">
                  Change
                </button>
              </div>
              <Modal show={this.state.isModalAvatar} onHide={this.handleModalAvatarClose}>
                <Modal.Body>
                  <Modal.Title className="text-c-purple3 f-w-bold">Change Foto</Modal.Title>
                  <div style={{ marginTop: '20px' }} className="form-group">
                    <label>Upload Foto</label>
                    <input
                      accept="image/*"
                      className="form-control"
                      name="avatar"
                      type="file"
                      onChange={this.handleChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Make sure the file format is png, jpg, jpeg, or gif and the file size is not more than 500KB
                    </Form.Text>
                  </div>
                  <div className="float-right">
                    <button type="button" onClick={this.onClickSubmitModal} className="btn btn-icademy-primary ml-2">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={this.onClickSubmitModalDelete}
                      className="btn btn-icademy-danger ml-2"
                    >
                      Delete Photo
                    </button>
                    <button type="button" className="btn btn-icademy-block ml-2" onClick={this.handleModalAvatarClose}>
                      Cancel
                    </button>
                  </div>
                </Modal.Body>
              </Modal>

              <form style={{ margin: '0 0px' }}>
                {toggle_alert && <Alert variant={'success'}>Your profile data has been saved successfully.</Alert>}
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Full name <required>*</required>
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    required
                    placeholder="Full name"
                    value={user_data.name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Registration number <required>*</required>
                  </label>
                  <input
                    name="identity"
                    type="numeric"
                    className="form-control"
                    required
                    placeholder="No. ktp"
                    inputMode="numeric"
                    value={user_data.identity == null ? '' : user_data.identity}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Mobile phone number <required>*</required>
                  </label>
                  <input
                    name="phone"
                    type="phone"
                    className="form-control"
                    required
                    placeholder="081247959214"
                    inputMode="tel"
                    value={user_data.phone}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <div className="col-sm-6 m-b-20">
                    <strong>Address is the same as Current Address</strong>
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

                <div className="row">
                  {/*  address */}
                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Address <required>*</required>
                      </label>
                      <input
                        name="address"
                        type="text"
                        className="form-control"
                        required
                        placeholder="Complete address"
                        value={user_data.address}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Province <required>*</required>
                      </label>
                      <ReactSelect
                        placeholder="Select Province"
                        isClearable={true}
                        value={user_data.selectedProvince}
                        onChange={(data) => this.handleChangeProvince({ data: data, current: 'not-current' })}
                        options={this.state.province}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        City <required>*</required>
                      </label>
                      <ReactSelect
                        placeholder="Select City"
                        isClearable={true}
                        value={user_data.selectedCity}
                        onChange={(data) => this.handleChangeCity({ data: data, current: 'not-current' })}
                        options={this.state.cities}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        District <required>*</required>
                      </label>
                      <input
                        name="selectedDistrict"
                        type="selectedDistrict"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete District"
                        value={user_data.selectedDistrict}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Sub District <required>*</required>
                      </label>
                      <input
                        name="selectedSubDistrict"
                        type="selectedSubDistrict"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete Sub District"
                        value={user_data.selectedSubDistrict}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        RW <required>*</required>
                      </label>
                      <input
                        name="rw"
                        type="rw"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete RW"
                        value={user_data.rw}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        RT <required>*</required>
                      </label>
                      <input
                        name="rt"
                        type="rt"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete RT"
                        value={user_data.rt}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  {/* current address */}
                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current Address <required>*</required>
                      </label>
                      <input
                        name="currentAddress"
                        type="text"
                        className="form-control"
                        required
                        placeholder="Complete Current Address"
                        value={user_data.currentAddress}
                        onChange={this.handleChange}
                        disabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current Province <required>*</required>
                      </label>
                      <ReactSelect
                        placeholder="Select Current Province"
                        isClearable={true}
                        value={user_data.selectedCurrentProvince}
                        onChange={(data) => this.handleChangeProvince({ data: data, current: 'current' })}
                        options={this.state.province}
                        isDisabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current City <required>*</required>
                      </label>
                      <ReactSelect
                        placeholder="Select Current City"
                        isClearable={true}
                        value={user_data.selectedCurrentCity}
                        onChange={(data) => this.handleChangeCity({ data: data, current: 'current' })}
                        options={this.state.cities}
                        isDisabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current District <required>*</required>
                      </label>
                      <input
                        name="selectedCurrentDistrict"
                        type="selectedCurrentDistrict"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete Current District"
                        value={user_data.selectedCurrentDistrict}
                        onChange={this.handleChange}
                        disabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current SubDistrict <required>*</required>
                      </label>
                      <input
                        name="selectedCurrentSubDistrict"
                        type="selectedCurrentSubDistrict"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete Current Sub District"
                        value={user_data.selectedCurrentSubDistrict}
                        onChange={this.handleChange}
                        disabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current RW <required>*</required>
                      </label>
                      <input
                        name="currentRw"
                        type="currentRw"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete Current RW"
                        value={user_data.currentRw}
                        onChange={this.handleChange}
                        disabled={this.state.switchButtonAddressSame}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-input" htmlFor>
                        Current RT <required>*</required>
                      </label>
                      <input
                        name="currentRt"
                        type="currentRt"
                        className="form-control"
                        required
                        inputMode="text"
                        placeholder="Complete Current RT"
                        value={user_data.currentRt}
                        onChange={this.handleChange}
                        disabled={this.state.switchButtonAddressSame}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Level
                  </label>
                  <label className="form-control" htmlFor>
                    {user_data.level === 'client' ? 'User' : user_data.level}
                  </label>
                </div>
                <button
                  className="btn btn btn-icademy-primary float-right mt-3"
                  onClick={(event) => this.updateProfile(event)}
                >
                  Save
                </button>
              </form>
            </div>
          </div>

          {/* <Card>
                        <Card.Body>
                          <form style={{ margin: "0 42px" }}>
                            <h3 className="f-24 f-w-bold mb-3">
                              Informasi Kontak
                            </h3>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Email
                              </label>
                              <input
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="aaaa@bbb.com"
                                value={user_data.email}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Password
                              </label>
                              <input
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="password"
                                onChange={this.handleChange}
                              />
                            </div>
                            <Link
                              to="/pengaturan"
                              className="btn btn-ideku btn-block m-t-10 f-20 f-w-600"
                            >
                              Ubah di Pengaturan
                            </Link>
                          </form>
                        </Card.Body>
                      </Card> */}

          {/* <Card>
                        <Card.Body>
                          <form style={{ margin: "0 42px" }}>
                            <h3 className="f-24 f-w-bold mb-3">
                              Informasi Kursus
                            </h3>

                            <ListAktivitas lists={kursusDiikuti} />
                          </form>
                        </Card.Body>
                      </Card> */}

          <Modal show={this.state.isNotifikasi} onHide={() => this.closeNotifikasi('isNotifikasi')}>
            <Modal.Body>
              <Modal.Title className="text-c-purple3 f-w-bold">Notifikasi</Modal.Title>

              <p style={{ color: 'black', margin: '20px 0px' }}>{this.state.isiNotifikasi}</p>

              <button
                type="button"
                className="btn btn-block f-w-bold"
                onClick={() => this.closeNotifikasi('isNotifikasi')}
              >
                Close
              </button>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.isUpdateData} onHide={() => this.closeNotifikasi('isUpdateData')}>
            <Modal.Body>
              <Modal.Title className="text-c-purple3 f-w-bold text-center">Update Your Data profile</Modal.Title>

              <button
                type="button"
                className="btn btn-block f-w-bold mt-2"
                onClick={() => this.closeNotifikasi('isUpdateData')}
              >
                Close
              </button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Profile;
