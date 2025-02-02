import React, { Component } from 'react';
import { Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API, { API_SERVER, APPS_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';
import { MultiSelect } from 'react-sm-select';
import TableFiles from '../../files/_files';
import TableMeetings from '../../meeting/meeting';
import WebinarKuesionerAdd from './kuesioneradd';
import WebinarPollAdd from './polladd';
import WebinarPretestAdd from './pretestadd';
import WebinarPosttestAdd from './posttestadd';
import WebinarPollingAdd from './pollingadd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SocketContext from '../../../socket';
import moment from 'moment-timezone'
import { withTranslation } from 'react-i18next';

class WebinarAddClass extends Component {

  state = {
    oldJamMulai: new Date(),
    webinarId: this.props.match.params.webinarId,
    isSending: false,
    role: [],
    access_project_admin: false,

    modalEssay: false,
    essay: '',
    essay_sent: '',

    pembicara: [
      // {nama: 'John Mayers', email: 'ardiansyah3ber@gmail.com', telepon: '082334093822', status: false, checked: false},
      // {nama: 'Marco Elive', email: 'marco.elive@gmail.com', telepon: '087757386772', status: false, checked: false},
      // {nama: 'Smity Jensen', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
    ],
    optionsName: [],

    // form webinar
    id: '',
    gambar: '',
    judul: '',
    isi: 'Loading...',
    tanggal: '',
    tanggalEnd: '',
    jamMulai: '',
    jamSelesai: '',
    projectId: '',
    dokumenId: '',
    peserta: [],
    kirimEmailPeserta: [],
    kirimEmailTamu: [],
    userId: '',
    companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,

    // form peserta
    pesertaId: [],
    isUploading: false,

    //import from other webinar
    importId: [],
    optionsImport: [],
    loadingImport: false,
    //import from training company
    importIdTC: [],
    optionsImportTC: [],
    loadingImportTC: false,

    // poll
    modalPolling: false,

    // form tamu
    nama: '',
    email: '',
    telepon: '',
    tamu: [],

    allChecked: false,
    allCheckedTamu: false,
    isModalPembicara: false,
    isModalPeserta: false,

    //kuesioner
    modalKuesioner: false,
    modalPretest: false,
    modalPosttest: false,
    modalPolling: false,

    //role
    sekretarisId: [],
  }

  // addTamu = e => {
  //   e.preventDefault();
  //   if (!this.state.nama && !this.state.email && !this.state.telepon) {
  //     toast.warning("Semua kolom harus terisi. (nama, email, & telepon).")
  //   } else {
  //     let form = {
  //       nama: this.state.nama,
  //       email: this.state.email,
  //       telepon: this.state.telepon,
  //       status: false,
  //       checked: false
  //     };
  //     this.setState({ tamu: [...this.state.tamu, form], nama: '', email: '', telepon: '' });
  //   }

  // }

  deleteTamu(id) {
    // let cpTamu = [...this.state.tamu];
    // let filter = cpTamu.filter((item) => item.email != e.target.getAttribute('data-email'));
    // this.setState({ tamu: filter });

    API.delete(`${API_SERVER}v2/webinar/tamu/${id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Gagal menghapus tamu')
        } else {
          toast.success(`Berhasil menghapus tamu`)
          this.fetchData();
        }
      }
    })
  }

  handleModal = () => {
    this.setState({
      isModalPembicara: false,
      isModalPeserta: false,
      modalKuesioner: false,
      modalPolling: false,
      modalPretest: false,
      modalPosttest: false,
      modalEssay: false,
      modalPolling: false,
      importId: [],
      importIdTC: [],
      pesertaId: []
    });
  }

  handleAllCheck = e => {
    e.preventDefault();
    let pem = this.state.peserta;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ peserta: pem, allChecked: e.target.checked });
  }

  handleOneCheck = e => {
    let pem = this.state.peserta;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ peserta: pem });
  }
  handleAllCheckTamu = e => {
    e.preventDefault();
    let pem = this.state.tamu;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ tamu: pem, allCheckedTamu: e.target.checked });
  }

  handleOneCheckTamu = e => {
    let pem = this.state.tamu;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ tamu: pem });
  }

  kirimEmail() {
    this.setState({ kirimEmailPeserta: [], kirimEmailTamu: [], isSending: true })
    this.state.peserta.map(item => {
      if (item.checked) {
        this.state.kirimEmailPeserta.push(item.id)
      }
    })
    this.state.tamu.map(item => {
      if (item.checked) {
        this.state.kirimEmailTamu.push(item.id)
      }
    })
    let form = {
      id: this.state.webinarId,
      pengguna: this.state.kirimEmailPeserta,
      tamu: this.state.kirimEmailTamu,
      time: `${moment.tz(this.state.tanggal, moment.tz.guess(true)).format("DD MMMM YYYY HH:mm")} until ${moment.tz(this.state.tanggalEnd, moment.tz.guess(true)).format("DD MMMM YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`
    };

    API.post(`${API_SERVER}v2/webinar/send_email`, form).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error sending email')
          this.setState({ isSending: false })
        } else {
          toast.success(`Successfully sent invitation email`)
          this.setState({ isSending: false })
          this.fetchData();
        }
      }
    })
  }

  checkProjectAccess(projectId) {
    API.get(`${API_SERVER}v1/project-access/${projectId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client') {
          this.setState({
            access_project_admin: true,
          })
        }
        else {
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }
  handleDynamicInput = (e) => {
    this.setState({ isi: e });
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar/one/${this.state.webinarId}`).then(res => {
      if (res.data.error) toast.warning("Gagal fetch API");
      const tanggal = res.data.result.start_time ? new Date(res.data.result.start_time) : '';
      const tanggalEnd = res.data.result.end_time ? new Date(res.data.result.end_time) : '';
      const jam_mulai = res.data.result.jam_mulai ? new Date('2020-09-19 ' + res.data.result.jam_mulai) : ''
      const jam_selesai = res.data.result.jam_selesai ? new Date('2020-09-19 ' + res.data.result.jam_selesai) : ''
      this.setState({
        id: this.state.webinarId,
        judul: res.data.result.judul,
        isi:
          res.data.result.isi ? res.data.result.isi
            :
            `<p>Welcome to "${res.data.result.judul}" webinar.<br/>
          If this webinar is accessible, a "Join the webinar" button will appear at the top right.<br/>
          You can download the attached file via the "Documents" section at the bottom left.<br/>
          You can ask questions during the webinar via the "Questions" section at the bottom right.<br/>
          <br/>
          This webinar uses ICADEMY.<p>`,
        tanggal: tanggal,
        tanggalEnd: tanggalEnd,
        jamMulai: jam_mulai,
        jamSelesai: jam_selesai,
        oldJamMulai: tanggal,
        projectId: res.data.result.project_id,
        dokumenId: res.data.result.dokumen_id,
        peserta: res.data.result.peserta,
        tamu: res.data.result.tamu,
        status: res.data.result.status,
        userId: Storage.get('user').data.user_id,
        sekretarisId: res.data.result.sekretaris,
        pembicara: [],
        essay: res.data.result.essay,
        essay_sent: res.data.result.essay_sent
      })
      if (!this.state.gambar) {
        this.setState({
          gambar: res.data.result.gambar,
        })
      }
      res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
      this.checkProjectAccess(this.state.projectId)
    })

    let sqlNotFromProject = `${API_SERVER}v1/user/all/company/${this.state.companyId}`;
    let sqlFromProject = `${API_SERVER}v2/project/user/${this.props.match.params.projectId}`;
    API.get(this.props.match.params.projectId != 0 ? sqlFromProject : sqlNotFromProject).then(response => {
      this.setState({ optionsName: [] })
      response.data.result.map(item => {
        this.state.optionsName.push({
          value: item.user_id,
          label: `${item.name} - ${item.email} - ${item.phone}`
        });
      });
    })

    API.get(`${API_SERVER}v2/webinar/list-by-company-plain/${this.state.companyId}`).then(res => {
      if (res.data.error) {
        // toast.warning("Error fetch API");
      }
      else {
        this.setState({ optionsImport: [] })
        res.data.result.map(item => {
          this.state.optionsImport.push({
            value: item.id,
            label: `${item.judul} = ${item.peserta.length} participant, ${item.tamu.length} guest`
          });
        });
      }
    })

    API.get(`${API_SERVER}v2/training/company/${this.state.companyId}`).then(res => {
      if (res.data.error) {
        toast.error('Error read company list for import feature')
      }
      else {
        this.setState({ optionsImportTC: [] })
        res.data.result.map(item => {
          this.state.optionsImportTC.push({
            value: item.id,
            label: item.name
          });
        });
      }
    })
  }

  showTambahPeserta() {
    if (this.state.judul == '' || this.state.isi == '' || this.state.tanggal == '' || this.state.tanggalEnd == '') {
      toast.warning('Please complete the event data first.')
    }
    else {
      this.updateWebinar()
      this.fetchData()
      this.setState({ isModalPeserta: true });
    }
  }

  updateWebinar(back) {

    // let dd = new Date(this.state.tanggal);
    // let tanggal = dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2) + '-' + ('0' + dd.getDate()).slice(-2);

    // let jamMl = new Date(this.state.jamMulai);
    // let jamMulai = ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2);

    // let jamSl = new Date(this.state.jamSelesai);
    // let jamSelesai = ('0' + jamSl.getHours()).slice(-2) + ':' + ('0' + jamSl.getMinutes()).slice(-2);

    let form = {
      id: this.state.webinarId,
      judul: this.state.judul,
      isi: this.state.isi,
      start_time: moment.tz(this.state.tanggal, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment.tz(this.state.tanggalEnd, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      status: this.state.status
    };
    if (form.start_time > form.end_time) {
      toast.warning(`End Time cannot be less than Start Time `);
    } else {

      API.put(`${API_SERVER}v2/webinar/detail`, form).then(async res => {
        if (res.data.error)
          toast.warning("Error fetch API")
        else
          if (this.state.gambar) {
            let formData = new FormData();
            formData.append('gambar', this.state.gambar);
            await API.put(`${API_SERVER}v2/webinar/cover/${form.id}`, formData);
          }

      // send notification
      let oldJamMul = moment(this.state.oldJamMulai).tz(moment.tz.guess(true)).format('DD MMMM YYYY HH:mm');
      let jamMul = moment(this.state.tanggal).tz(moment.tz.guess(true)).format('DD MMMM YYYY HH:mm');
      if (oldJamMul != jamMul) {
        let sendNotif = {
          type: 7,
          company_id: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,
          user_id: this.state.peserta.map(item => item.user_id),
          activity_id: this.state.webinarId,
          desc: `"${this.state.judul}" ${this.props.match.params.training === 'by-training' ? 'live Class' : 'webinar'} that will start on ${oldJamMul} has changed to ${jamMul} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
          dest: `${APPS_SERVER}webinar/live/${this.state.webinarId}`,
        };
        API.post(`${API_SERVER}v1/notification/broadcast-bulk`, sendNotif).then(res => {
          back && this.props.history.goBack();
        })
      }
      toast.success("Save webinar information")
    })
    }
  }

  backButton() {
    this.props.history.goBack();
  }

  addPeserta = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      userId: this.state.pesertaId.toString(),
    };
    formData.userId ?
      API.post(`${API_SERVER}v2/webinar/peserta`, formData).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Gagal menambah peserta')
          } else {
            toast.success(`Berhasil menambah peserta`)
            this.setState({ pesertaId: [] })
            this.fetchData();
            let sendNotif = {
              type: 7,
              company_id: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,
              user_id: formData.userId,
              activity_id: this.state.webinarId,
              desc: `You are invited to "${this.state.judul}" ${this.props.match.params.training === 'by-training' ? 'live Class' : 'webinar'} that will start on ${moment(this.state.tanggal).local().format("DD MMMM YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone`,
              dest: `${APPS_SERVER}webinar/live/${this.state.webinarId}`,
            };
            API.post(`${API_SERVER}v1/notification/broadcast`, sendNotif);
          }
        }
      })
      :
      toast.warning('Silahkan pilih peserta terlebih dahulu')
  }

  importPeserta = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      importId: this.state.importId.toString(),
    };
    if (formData.importId) {
      this.setState({ loadingImport: true });
      API.post(`${API_SERVER}v2/webinar/import-participant`, formData).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Copy participant & guest failed')
            this.setState({ loadingImport: false });
          } else {
            toast.success(`Success copy participant & guest`)
            this.setState({ importId: [], loadingImport: false });
            this.fetchData();
          }
        }
      })
    }
    else {
      toast.warning('Please choose webinar first')
    }
  }

  importGuest = e => {
    e.preventDefault();
    if (!this.state.file) {
      toast.warning('Choose the file first')
    }
    else {
      this.setState({ isUploading: true })
      let form = new FormData();
      form.append('webinar_id', this.state.webinarId);
      form.append('file', this.state.file)
      API.post(`${API_SERVER}v2/webinar/tamu/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(res.data.result)
            this.setState({ isUploading: false, file: '' });
          }
          else {
            toast.success('Data import success')
            this.setState({ isUploading: false, file: '' });
            this.fetchData();
          }
        }
      })
    }
  }

  importPesertaTC = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      importId: this.state.importIdTC.toString(),
    };
    if (formData.importId) {
      this.setState({ loadingImportTC: true });
      API.post(`${API_SERVER}v2/webinar/import-participant-tc`, formData).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Copy participant failed')
            this.setState({ loadingImportTC: false });
          } else {
            toast.success(`Success copy participant`)
            this.setState({ importIdTC: [], loadingImportTC: false });
            this.fetchData();
          }
        }
      })
    }
    else {
      toast.warning('Please choose training company first')
    }
  }

  deletePeserta(id) {
    API.delete(`${API_SERVER}v2/webinar/peserta/${id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Delete participant failed')
        } else {
          toast.success(`Success delete participant`)
          this.fetchData();
        }
      }
    })
  }

  addTamu = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      name: this.state.nama,
      email: this.state.email,
      phone: this.state.telepon,
    };
    formData.email || formData.name || formData.phone ?
      API.post(`${API_SERVER}v2/webinar/tamu`, formData).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Add guest failed')
          } else {
            toast.success(`Success add guest`)
            this.setState({ nama: '', email: '', telepon: '' })
            this.fetchData();
          }
        }
      })
      :
      toast.warning('Please fill guest data first')
  }
  handleChangeFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  }

  handleDynamicInputEssay = (e) => {
    this.setState({ essay: e });
  }

  saveEssay = (e) => {
    console.log('save essay')
    let form = {
      sent: this.state.essay_sent,
      essay: this.state.essay
    }
    API.put(`${API_SERVER}v2/webinar/send-essay/${this.state.webinarId}`, form).then(res => {
      const { error } = res.data
      if (error) {
        toast.warning(`Failed update essay.`)
      } else {
        toast.success(`Esay updated.`)
      }
    })
  }

  render() {
    const { t } = this.props

    // const role = this.state.role
    let levelUser = Storage.get('user').data.level;

    const TabelPembicara = ({ items }) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>{t('name')}</th>
            <th>Email</th>
            <th>{t('phone')}</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.length && items.map((item, i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status == 1 ? 'Sent' : item.status == 2 ? 'Present' : item.status == 3 ? 'Not Present' : 'Not Yet Sent'}</td>
                <td>
                  <i className="fa fa-trash" style={{ cursor: 'pointer' }}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelPeserta = ({ items }) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>{t('name')}</th>
            <th>Email</th>
            <th>{t('phone')}</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.length === 0 &&
            <tr>
              <td colspan='6'>there's no participant</td>
            </tr>
          }
          {
            items.map((item, i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.status == 1 ? 'Sent' : item.status == 2 ? 'Present' : item.status == 3 ? 'Not Present' : 'Not Yet Sent'}</td>
                <td>
                  <i onClick={this.deletePeserta.bind(this, item.id)} className="fa fa-trash" style={{ cursor: 'pointer' }}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelTamu = ({ items }) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allCheckedTamu} checked={this.state.allCheckedTamu} onChange={this.handleAllCheckTamu} /></th>
            <th>{t('name')}</th>
            <th>Email</th>
            <th>{t('phone')}</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.length === 0 &&
            <tr>
              <td colspan='6'>there's no guest</td>
            </tr>
          }
          {
            items.map((item, i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheckTamu} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.status == 1 ? 'Sent' : item.status == 2 ? 'Present' : item.status == 3 ? 'Not Present' : 'Not Yet Sent'}</td>
                <td>
                  <i onClick={this.deleteTamu.bind(this, item.id)} data-email={item.email} className="fa fa-trash" style={{ cursor: 'pointer' }}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    return (
      <div className="row">
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-4">
                  <h3 className="f-w-900 f-18 fc-blue">
                    <Link onClick={this.backButton.bind(this)} className="btn btn-sm mr-4" style={{
                      border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                    }}>
                      <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                    </Link>
                    Detail {this.props.match.params.training === 'by-training' ? 'Live Class' : 'Webinar'}
                  </h3>
                </div>
                <div className="col-sm-8 text-right">
                  <div className="form-group">
                    {
                      (levelUser != 'client' || this.state.sekretarisId.filter((item) => item.user_id == this.state.userId).length >= 1) &&
                      <button onClick={() => this.setState({ modalKuesioner: true })} className="btn btn-icademy-primary float-right"><i className="fa fa-plus"></i> Feedback Form</button>
                    }
                    {
                      (levelUser != 'client' || this.state.sekretarisId.filter((item) => item.user_id == this.state.userId).length >= 1) &&
                      <button onClick={() => this.setState({ modalPosttest: true })} className="btn btn-icademy-primary float-right" style={{ marginRight: 10 }}><i className="fa fa-plus"></i> Post Test</button>
                    }
                    {
                      (levelUser != 'client' || this.state.sekretarisId.filter((item) => item.user_id == this.state.userId).length >= 1) &&
                      <button onClick={() => this.setState({ modalPretest: true })} className="btn btn-icademy-primary float-right" style={{ marginRight: 10 }}><i className="fa fa-plus"></i> Pre Test</button>
                    }
                    {
                      (levelUser != 'client' || this.state.sekretarisId.filter((item) => item.user_id == this.state.userId).length >= 1) &&
                      <button onClick={() => this.setState({ modalEssay: true })} className="btn btn-icademy-primary float-right" style={{ marginRight: 10 }}><i className="fa fa-plus"></i> Essay</button>
                    }
                    {
                      (levelUser != 'client' || this.state.sekretarisId.filter((item) => item.user_id == this.state.userId).length >= 1) &&
                      <button onClick={() => this.setState({ modalPolling: true })} className="btn btn-icademy-primary float-right" style={{ marginRight: 10 }}><i className="fa fa-plus"></i> Polling</button>
                    }
                  </div>
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="bold">{this.props.match.params.training === 'by-training' ? 'Live Class' : 'Webinar'} Image</label>
                      <div className="row">
                        <div className="col-sm-3">
                          <img className="img-fluid" src={this.state.gambar == '' || this.state.gambar == null ? `/newasset/imginput.png` : typeof this.state.gambar === 'object' && this.state.gambar !== null ? URL.createObjectURL(this.state.gambar) : this.state.gambar} />
                        </div>
                        <div className="col-sm-2">
                          <input type="file" name="gambar" onChange={e => { if (e.target.files.length) { this.setState({ gambar: e.target.files[0] }); } }} className="ml-5 btn btn-sm btn-default" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="bold">{this.props.match.params.training === 'by-training' ? 'Live Class' : 'Webinar'} Title<required>*</required></label>
                      <input type="text" className="form-control" name="judul" onChange={e => this.setState({ judul: e.target.value })} value={this.state.judul} />
                    </div>

                    <div className="form-group">
                      <label className="bold">Description<required>*</required></label>
                      <input id={`myFile`} type="file" name={`myFile`} style={{ display: "none" }} onChange="" />
                      {
                        this.state.isi !== 'Loading...' ?
                          <Editor
                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                            initialValue={this.state.isi}
                            value={this.state.isi}
                            init={{
                              height: 400,
                              width: "100%",
                              menubar: false,
                              convert_urls: false,
                              image_class_list: [
                                { title: 'None', value: '' },
                                { title: 'Responsive', value: 'img-responsive' },
                                { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                              ],
                              file_browser_callback_types: 'image media',
                              file_picker_callback: function (callback, value, meta) {
                                if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                                  var input = document.getElementById(`myFile`);
                                  input.click();
                                  input.onchange = function () {

                                    var dataForm = new FormData();
                                    dataForm.append('file', this.files[0]);

                                    window.$.ajax({
                                      url: `${API_SERVER}v2/media/upload`,
                                      type: 'POST',
                                      data: dataForm,
                                      processData: false,
                                      contentType: false,
                                      success: (data) => {
                                        callback(data.result.url);
                                        this.value = '';
                                      }
                                    })

                                  };
                                }
                              },
                              plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount"
                              ],
                              media_live_embeds: true,
                              toolbar:
                                // eslint-disable-next-line no-multi-str
                                "undo redo | fontsizeselect bold italic backcolor forecolor | \
                              alignleft aligncenter alignright alignjustify | image | media | \
                                  bullist numlist outdent indent | removeformat | help"
                            }}
                            onEditorChange={e => this.handleDynamicInput(e)}
                          />
                          : null
                      }
                    </div>

                    <div className="form-group row">
                      <div style={{ paddingLeft: '15px' }}>
                        <label>Start Time<required>*</required></label>
                        <div style={{ clear: 'both' }}>
                          <DatePicker
                            dateFormat="dd MMMM yyyy HH:mm"
                            selected={this.state.tanggal}
                            onChange={e => this.setState({ tanggal: e })}
                            showTimeSelect
                            timeIntervals={30}
                          />
                        </div>
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <label>End Time<required>*</required></label>
                        <div style={{ clear: 'both' }}>
                          <DatePicker
                            dateFormat="dd MMMM yyyy HH:mm"
                            selected={this.state.tanggalEnd}
                            onChange={e => this.setState({ tanggalEnd: e })}
                            showTimeSelect
                            timeIntervals={30}
                          />
                        </div>
                      </div>
                      {/* <div className="col-sm-4">
                        <label className="bold col-sm-12"> Starting Hours </label>
                        <DatePicker
                          selected={this.state.jamMulai}
                          onChange={date => this.setState({ jamMulai: date })}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold col-sm-12"> End Hours </label>
                        <DatePicker
                          selected={this.state.jamSelesai}
                          onChange={date => this.setState({ jamSelesai: date })}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div> */}
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="bold">Speaker</label>
                        <div class="input-group">
                          <input disabled type="text" value={this.state.pembicara.toString()} className="form-control" />
                          {/* <span className="input-group-btn">
                            <button onClick={e => this.setState({ isModalPembicara: true })} className="btn btn-default">
                              <i className="fa fa-plus"></i> Add
                            </button>
                          </span> */}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <label className="bold"> Participants </label>
                        <div class="input-group">
                          <input value={(this.state.peserta ? this.state.peserta.length : 0) + (this.state.tamu ? this.state.tamu.length : 0)} type="text" className="form-control" />
                          <span className="input-group-btn">
                            <button onClick={this.showTambahPeserta.bind(this)} className="btn btn-default">
                              <i className="fa fa-plus"></i> Add
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    {
                      this.props.match.params.training === 'by-training' ?
                        null :
                        <div className="form-group row">
                          <div className="col-sm-12">
                            <label className="bold">Folder & File</label>
                            <div className="col-sm-12">
                              <div id="scrollin" style={{ height: '300px', marginBottom: '0px', overflowY: 'scroll', border: '1px solid #CCC' }}>
                                {this.state.dokumenId ? <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.state.dokumenId} webinarId={this.state.webinarId} /> : 'you have not chosen the location of the folder where the document will be saved. Edit the webinar and select a folder to enable this feature.'}
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                    {
                      this.props.match.params.training === 'by-training' ?
                        null :
                        <div className="form-group row">
                          <div className="col-sm-12">
                            <label className="bold">Meeting Room</label>
                            <div className="col-sm-12">
                              <div id="scrollin" style={{ height: '300px', marginBottom: '0px', overflowY: 'scroll', border: '1px solid #CCC' }}>
                                <TableMeetings webinarId={this.state.webinarId} access_project_admin={this.state.access_project_admin} projectId={this.props.match.params.projectId} />
                              </div>
                            </div>
                          </div>
                        </div>
                    }

                    {/* <div className="form-group row">
                      <div className="col-sm-8">
                        <label className="bold">Ruangan Webinar</label>
                        <div className="jumbotron text-center">
                          <h2>
                            <img src="/newasset/vid.jpg" width="200px" />
                          </h2>
                          <Link to="" className="btn btn-sm btn-info btn-v2 mr-2">Masuk</Link>
                          <Link to="" className="btn btn-sm btn-warning btn-v2">Langsung Masuk</Link>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Meeting Internal</label>
                        <div className="jumbotron text-center">
                          <h2>
                            <img src="/newasset/vid.jpg" width="80px" />
                          </h2>
                          <Link to="" className="btn btn-sm btn-warning btn-v2">Masuk</Link>
                        </div>
                      </div>
                    </div> */}

                    <div className="form-group">
                      <button onClick={this.updateWebinar.bind(this, true)} className="btn btn-icademy-primary float-right"><i className="fa fa-save"></i> Save</button>
                    </div>

                  </div>
                </div>

              </div>
            </Card.Body>
          </Card>

          <Modal
            show={this.state.isModalPembicara}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Body>
              <h5>
                Pembicara
              </h5>

              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group">
                  <label>Cari Pembicara</label>
                  <div class="input-group">
                    {<input type="text" list="pembicara" className="form-control" />}
                    <span className="input-group-btn">
                      <button className="btn btn-default">
                        <i className="fa fa-search"></i> Cari
                      </button>
                    </span>
                  </div>
                </div>

                <TabelPembicara items={this.state.pembicara} />
              </div>

              <button
                type="button"
                className="btn btn-v2 btn-primary f-w-bold mr-2"
              >
                <i className="fa fa-envelope"></i>
                Send email
              </button>
              <button
                type="button"
                className="btn btn-v2 btn-success f-w-bold mr-2"
              >
                <i className="fa fa-save"></i>
                Save
              </button>
              <button
                type="button"
                className="btn btn-v2 f-w-bold"
                onClick={this.handleModal}
              >
                Close
              </button>
            </Modal.Body>
          </Modal>

          <Modal
            show={this.state.isModalPeserta}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Webinar Participants
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group">
                  <label>Copy from other webinar</label>
                  <div class="input-group" style={{ background: 'none' }}>
                    <MultiSelect
                      id={`userId`}
                      options={this.state.optionsImport}
                      value={this.state.importId}
                      onChange={importId => this.setState({ importId })}
                      mode="single"
                      enableSearch={true}
                      resetable={true}
                      valuePlaceholder="Select Webinar"
                    />
                    <span className="input-group-btn">
                      <button disabled={this.state.loadingImport} className="btn btn-default" onClick={this.importPeserta.bind(this)}>
                        <i className="fa fa-plus"></i> {this.state.loadingImport ? '....' : 'Import'}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              {
                this.props.match.params.training === 'by-training' ?
                  <div style={{ marginTop: "20px" }} className="form-group">
                    <div className="form-group">
                      <label>Copy from training company</label>
                      <div class="input-group" style={{ background: 'none' }}>
                        <MultiSelect
                          id={`userId`}
                          options={this.state.optionsImportTC}
                          value={this.state.importIdTC}
                          onChange={importIdTC => this.setState({ importIdTC })}
                          mode="single"
                          enableSearch={true}
                          resetable={true}
                          valuePlaceholder="Select Training Company"
                        />
                        <span className="input-group-btn">
                          <button disabled={this.state.loadingImportTC} className="btn btn-default" onClick={this.importPesertaTC.bind(this)}>
                            <i className="fa fa-plus"></i> {this.state.loadingImportTC ? '....' : 'Import'}
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  : null
              }
              <h5> Participants </h5>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group">
                  <label> Find Participants</label>
                  <div class="input-group" style={{ background: 'none' }}>
                    <MultiSelect
                      id={`userId`}
                      options={this.state.optionsName}
                      value={this.state.pesertaId}
                      onChange={pesertaId => this.setState({ pesertaId })}
                      mode="single"
                      enableSearch={true}
                      resetable={true}
                      valuePlaceholder="Please select user"
                      allSelectedLabel="Please select user"
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" onClick={this.addPeserta.bind(this)}>
                        <i className="fa fa-plus"></i> Add
                      </button>
                    </span>
                  </div>
                </div>

                <TabelPeserta items={this.state.peserta} />
              </div>

              <h5> Guest</h5>
              <label>Import guest from excel</label>
              <div>
                <a href={`${API_SERVER}template-excel/template-import-webinar-guest.xlsx`}>
                  <button className="button-bordered">
                    <i
                      className="fa fa-download"
                      style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                    />
                    Download Template
                  </button>
                </a>
              </div>
              <form className="col-sm-12 form-field-top-label" onSubmit={this.importGuest} style={{ paddingLeft: 0 }}>
                <label for='file-import' style={{ cursor: 'pointer', overflow: 'hidden' }}>
                  <div className="button-bordered-grey">
                    {this.state.file ? this.state.file.name : 'Choose'}
                  </div>
                </label>
                <input type="file" id='file-import' name='file-import' onChange={this.handleChangeFile} onClick={e => e.target.value = null} />
                <button type="submit" className="button-gradient-blue" style={{ marginLeft: 20 }}>
                  <i
                    className="fa fa-upload"
                    style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                  />
                  {this.state.isUploading ? 'Uploading...' : 'Import'}
                </button>
              </form>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group row">
                  <div className="col-sm-3">
                    <label> Name </label>
                    <input type="text" name="nama" value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label>Email</label>
                    <input type="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label> Phone </label>
                    <input type="text" name="telepon" value={this.state.telepon} onChange={e => this.setState({ telepon: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <button onClick={this.addTamu} className="btn btn-default" style={{ marginTop: '25px' }}><i className="fa fa-plus"></i> Add</button>
                  </div>
                </div>

                <TabelTamu items={this.state.tamu} />
              </div>

              <button
                type="button"
                className="btn btn-icademy-warning m-2"
                onClick={this.kirimEmail.bind(this)}
              >
                <i className="fa fa-envelope"></i>
                {this.state.isSending ? 'Sending Invitation...' : 'Send email'}
              </button>
              <button
                type="button"
                className="btn btn-icademy-primary m-2"
                onClick={this.handleModal}
              >
                <i className="fa fa-save"></i>
                Close
              </button>
              {/* <button
                type="button"
                className="btn btn-icademy-grey m-2"
                onClick={this.handleModal}
              >
                Close
              </button> */}
            </Modal.Body>
          </Modal>
          {/* <Modal
            show={this.state.modalPolling}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Poll
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <WebinarPollAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal> */}
          <Modal
            show={this.state.modalKuesioner}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Feedback Form
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <WebinarKuesionerAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.modalPolling}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Polling
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <WebinarPollingAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.modalPretest}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Pre Test
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <WebinarPretestAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.modalEssay}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Essay
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Editor
                apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                initialValue={this.state.essay}
                value={this.state.essay}
                init={{
                  height: 400,
                  width: "100%",
                  menubar: false,
                  convert_urls: false,
                  image_class_list: [
                    { title: 'None', value: '' },
                    { title: 'Responsive', value: 'img-responsive' },
                    { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                  ],
                  file_browser_callback_types: 'image media',
                  file_picker_callback: function (callback, value, meta) {
                    if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                      var input = document.getElementById(`myFile`);
                      input.click();
                      input.onchange = function () {

                        var dataForm = new FormData();
                        dataForm.append('file', this.files[0]);

                        window.$.ajax({
                          url: `${API_SERVER}v2/media/upload`,
                          type: 'POST',
                          data: dataForm,
                          processData: false,
                          contentType: false,
                          success: (data) => {
                            callback(data.result.url);
                            this.value = '';
                          }
                        })

                      };
                    }
                  },
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount"
                  ],
                  media_live_embeds: true,
                  toolbar:
                    // eslint-disable-next-line no-multi-str
                    "undo redo | fontsizeselect bold italic backcolor forecolor | \
                alignleft aligncenter alignright alignjustify | image | media | \
                    bullist numlist outdent indent | removeformat | help"
                }}
                onEditorChange={e => this.handleDynamicInputEssay(e)}
              />
            </Modal.Body>
            <Modal.Footer>
              <button onClick={e => this.saveEssay(e)} className="btn btn-v2 btn-primary"><i className="fa fa-save"></i> Save</button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={this.state.modalPosttest}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Post Test
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <WebinarPosttestAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

const WebinarAdd = props => (
  <SocketContext.Consumer>
    {socket => <WebinarAddClass {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const WebinarWithTranslation = withTranslation('common')(WebinarAdd)

export default WebinarWithTranslation;
