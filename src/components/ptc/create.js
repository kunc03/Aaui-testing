import React from 'react';
import { Link } from 'react-router-dom';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import moment from 'moment-timezone';
import { toast } from 'react-toastify';

class PtcCreate extends React.Component {

  state = {
    jenis: this.props.match.params.jenis,
    idPtc: this.props.match.params.id,

    nama_ruangan: '',
    folderId: [],
    moderator: Storage.get('user').data.level === "client" ? Storage.get('user').data.user_id : [],
    tanggal_mulai: new Date(),
    waktu_mulai: '',
    is_private: false,
    is_scheduled: false,

    companyId: Storage.get('user').data.company_id,
    level: Storage.get('user').data.level,
    files: [],
    users: []
  };

  handleCheckbox = e => {
    let { name, value, checked } = e.target;
    this.setState({ [name]: checked })
  }

  createPtc = e => {
    e.preventDefault()
    if (this.state.idPtc) {
      // action for update
      let form = {
        company_id: this.state.companyId,
        nama_ruangan: this.state.nama_ruangan,
        folder_id: this.state.folderId,
        moderator: this.state.moderator,
        tag: 1,
        tanggal_mulai: this.state.tanggal_mulai,
        waktu_mulai: this.state.waktu_mulai,
        is_private: this.state.is_private,
        is_scheduled: this.state.is_scheduled,
      }
      console.log('form: ', form);
      API.put(`${API_SERVER}v1/ptc-room/update/${this.state.idPtc}`, form).then(res => {
        if (res.data.error) {
          console.log('Error: ', res.data.result)
        }
        else {
          toast.success('new PTC added');
          this.props.history.goBack();
        }

        this.clearForm();
      })

    } else {
      // action for insert
      let form = {
        company_id: this.state.companyId,
        tag: 1,
        nama_ruangan: this.state.nama_ruangan,
        folder_id: this.state.folderId,
        moderator: this.state.moderator,
        tanggal_mulai: this.state.tanggal_mulai,
        waktu_mulai: this.state.waktu_mulai,
        is_private: this.state.is_private,
        is_scheduled: this.state.is_scheduled,
      }

      console.log('form: ', form);
      API.post(`${API_SERVER}v1/add/ptc-room`, form).then(res => {
        if (res.data.error) {
          console.log('Error: ', res.data.result)
        }
        else {
          toast.success('new PTC added');
          this.props.history.goBack();
        }

        this.clearForm();
      })
    }

  }

  componentDidMount() {
    if (this.state.idPtc) {
      this.fetchPtc();
    } else {
      this.fetchFiles();
      this.fetchUsers();
    }
  }

  clearForm() {
    this.setState({
      nama_ruangan: '',
      folderId: [],
      moderator: Storage.get('user').data.level === "client" ? Storage.get('user').data.user_id : [],
      tanggal_mulai: new Date(),
      waktu_mulai: '',
      is_private: false,
      is_scheduled: false,
    })
  }

  fetchPtc() {
    return Promise.all([
      this.fetchFiles(),
      this.fetchUsers()
    ]).then(() => {
      API.get(`${API_SERVER}v1/ptc-room/${this.state.idPtc}`).then(res => {
        if (res.data.error) console.log('Error: ', res.data.result)

        let respon = res.data.result;

        this.setState({
          nama_ruangan: respon.nama_ruangan,
          folderId: [respon.folder_id],
          moderator: [respon.moderator],
          tanggal_mulai: moment(respon.tanggal_mulai).format('YYYY-MM-DD'),
          waktu_mulai: respon.waktu_mulai,
          is_private: respon.is_private ? true : false,
          is_scheduled: respon.is_scheduled ? true : false,
        })
      })
    });
  }

  fetchFiles() {
    API.get(`${API_SERVER}v1/folder/${this.state.companyId}/0`).then(response => {
      response.data.result.map(item => {
        this.state.files.push({ value: item.id, label: item.name });
      });
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  fetchUsers() {
    API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
      // console.log(response)
      let filter = response.data.result.filter(item => item.level === "client" && item.grup_name.toLowerCase() === "guru");
      filter.map(item => {
        this.state.users.push({ value: item.user_id, label: item.name });
      });
    });
  }

  render() {

    //console.log('state: ', this.state)

    var selection = [];
    for (var i = 0; i < 24; i++) {
      var j = zeroFill(i, 2);
      selection.push(j + ":00");
      selection.push(j + ":30");
    }

    function zeroFill(number, width) {
      width -= number.toString().length;
      if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
      }
      return number + ""; // always return a string
    }

    return (
      <>
        <div className="floating-back">
          <Link to={`/ptc`}>
            <img
              src={`newasset/back-button.svg`}
              alt=""
              width={90}
            />
          </Link>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header header-kartu">
                Parent Teacher Conference Room
            </div>
              <div className="card-body">
                <form className="form-vertical" onSubmit={this.createPtc}>
                  <div className="form-group">
                    <label>Room Name</label>
                    <input required name="nama_ruangan" onChange={e => this.setState({ [e.target.name]: e.target.value })} value={this.state.nama_ruangan} type="text" className="form-control col-sm-8" placeholder="enter" />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label>Moderator</label>
                      {
                        (this.state.level === "admin" || this.state.level === "superadmin") &&
                        <MultiSelect
                          id={`moderator`}
                          options={this.state.users}
                          value={this.state.moderator}
                          onChange={pembicaraId => this.setState({ moderator: pembicaraId })}
                          mode="single"
                          enableSearch={true}
                          resetable={true}
                          valuePlaceholder="Pilih Moderator"
                          allSelectedLabel="All"
                        />
                      }
                      {
                        this.state.level === "client" &&
                        <input disabled name="moderator" value={Storage.get('user').data.user} type="text" className="form-control" placeholder="enter" />
                      }
                    </div>
                    <div className="col-sm-4">
                      <label>Folder</label>
                      <MultiSelect
                        id="folder"
                        options={this.state.files}
                        value={this.state.folderId}
                        onChange={valuesFolder => this.setState({ folderId: valuesFolder })}
                        mode="single"
                        enableSearch={true}
                        resetable={true}
                        valuePlaceholder="Select Folder"
                        allSelectedLabel="All"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-2">
                      <label> Date </label>
                      <input required name="tanggal_mulai" onChange={e => this.setState({ [e.target.name]: e.target.value })} value={this.state.tanggal_mulai} type="date" className="form-control" placeholder="enter" />
                    </div>
                    <div className="col-sm-2">
                      <label>Jam</label>
                      <select required name="waktu_mulai" onChange={e => this.setState({ [e.target.name]: e.target.value })} value={this.state.waktu_mulai} className="form-control">
                        <option value="" disabled selected>Pilih</option>
                        {
                          selection.map(item => (
                            <option value={item}>{item}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {
                    /**
                    <div className="form-group">
                    <label> Participants </label>
                    <div class="input-group col-sm-3" style={{background: 'none', paddingLeft: 0}}>
                    <input value="100" type="text" className="form-control" />
                    <span className="input-group-btn">
                    <button className="btn btn-default">
                    <i className="fa fa-plus"></i> Add
                    </button>
                    </span>
                    </div>
                    </div>
                    */
                  }
                  <div class="form-group mb-4 mt-4">
                    <label class="container">
                      Private Meeting
                    <input type="checkbox" name="is_private" checked={this.state.is_private} onChange={this.handleCheckbox} />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  {
                    /**
                    <div class="form-group mb-4 mt-4">
                    <label class="container">
                    Scheduled Meeting
                    <input type="checkbox" name="is_scheduled" checked={this.state.is_scheduled} onChange={this.handleCheckbox} />
                    <span className="checkmark"></span>
                    </label>
                    </div>
                    */
                  }
                  <div className="form-group">
                    <button type="submit" className="btn btn-v2 btn-primary">
                      <i className="fa fa-save"></i> Save
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </>
    )
  }
}

export default PtcCreate;
