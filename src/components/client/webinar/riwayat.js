import React, { Component } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { toast } from "react-toastify";
import TableFiles from '../../files/_files';
import Storage from './../../../repository/storage';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'

import { pad } from '../../../actions/helper'

import { Doughnut } from 'react-chartjs-2';

export default class WebinarRiwayat extends Component {

  state = {
    isCheckAll: false,
    isLoading: false,
    hasilTest: [],
    hasilEssay: [],
    certificate_orientation: 'landscape',
    certificate_background: '',
    nama: '',
    ttd: '',
    checkAll: false,
    tanggal: '',
    tanggalEnd: '',
    company_id: '',
    filterPeserta: 'Semua',
    webinarId: this.props.match.params.webinarId,
    pesertaX: [
      { nama: 'Ahmad', status: 'Selesai', jam_mulai: '08:01', jam_selesai: '09:01', via: 'Voucher', durasi: '1 Jam' },
      { nama: 'Ardiansyah', status: 'Selesai', jam_mulai: '08:00', jam_selesai: '09:00', via: 'Login', durasi: '1 Jam' },
    ],
    peserta: [],
    lampiran: [
      { id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com' },
      { id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com' },
      { id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com' },
    ],

    isModalDownloadFileWebinar: false,
    isModalSertifikat: false,
    access_project_admin: false,
    jumlahHadir: 0,
    jumlahTidakHadir: 0,
    qna: [],
    poll: [],
    jawabanKuesioner: {
      pertanyaan: [
        "",
      ],
      jawaban: [
        {
          nama: "",
          jawaban: [
            ""
          ]
        }
      ]
    },
    sertifikat: [],
    companyLogo: '',
    cert_logo: '',
    cert_title: 'CERTIFICATE OF COMPLETION',
    cert_subtitle: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO',
    cert_description: 'FOR SUCCESSFULLY COMPLETING ALL CONTENTS ON WEBINAR',
    cert_topic: '',
    sign: [
      {
        cert_sign_name: '',
        cert_sign_title: '',
        signature: ''
      }
    ],

    //role webinar
    pembicara: []
  }

  fetchQNA() {
    API.get(`${API_SERVER}v2/webinar/qna/${this.state.webinarId}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ qna: res.data.result })
    })
  }
  fetchPoll() {
    API.get(`${API_SERVER}v2/webinar-test-polling/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ poll: res.data.result })
        }
      }
    })
  }
  fetchCompanyInfo() {
    API.get(`${API_SERVER}v1/company/${this.state.company_id}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ companyLogo: res.data.result.logo })
    })
  }
  fetchJawabanKuesioner() {
    API.get(`${API_SERVER}v2/kuesioner/result/${this.state.webinarId}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ jawabanKuesioner: res.data.result })
    })
  }
  fetchJawabanTest() {
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ hasilTest: res.data.result })
    })
  }

  backButton() {
    this.props.history.goBack();
  }

  handleModal = () => {
    let item = this.state.peserta
    if (this.state.filterPeserta === 'Hadir') {
      item = item.filter(item => item.status === 2)
    }
    else if (this.state.filterPeserta === 'Tidak Hadir') {
      item = item.filter(item => item.status !== 2)
    }
    item.map((item, index) => {
      item.checked = null;
    })
    this.setState({
      item,
      checkAll: false,
      isModalDownloadFileWebinar: false,
      isModalSertifikat: false,
      certificate_orientation: 'landscape',
      certificate_background: '',
      nama: '',
      ttd: '',
      sertifikat: [],
      cert_title: 'CERTIFICATE OF COMPLETION',
      cert_subtitle: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO',
      cert_description: 'FOR SUCCESSFULLY COMPLETING ALL CONTENTS ON WEBINAR',
      cert_topic: '',
      sign: [
        {
          cert_sign_name: '',
          cert_sign_title: '',
          signature: ''
        }
      ],
    });

  }

  fetchDataWithoutLoading() {
    API.get(`${API_SERVER}v2/webinar/history/${this.state.webinarId}`).then(res => {
      if (res.data.error) toast.warning("Gagal fetch API");
      let peserta = res.data.result.peserta
      let pesertaDanTamu = peserta.concat(res.data.result.tamu)
      this.setState({
        id: this.state.webinarId,
        company_id: res.data.result.company_id,
        certificate_orientation: res.data.result.certificate_orientation,
        certificate_background: res.data.result.certificate_background,
        gambar: res.data.result.gambar,
        judul: res.data.result.judul,
        cert_topic: res.data.result.judul,
        isi: res.data.result.isi,
        tanggal: res.data.result.start_time,
        tanggalEnd: res.data.result.end_time,
        // projectId: res.data.result.projectId,
        dokumenId: res.data.result.dokumenId,
        status: res.data.result.status,
        peserta: pesertaDanTamu,
        jumlahTamu: res.data.result.tamu.length,
        jumlahPeserta: peserta.length,
        projectId: res.data.result.project_id,
        jumlahHadir: pesertaDanTamu.filter((item) => item.status == 2).length,
        jumlahTidakHadir: pesertaDanTamu.filter((item) => item.status != 2).length,
        isLoading: false
      })
      this.setState({ pembicara: [] })
      res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
      this.checkProjectAccess()
    })
  }

  fetchData() {
    this.setState({ isLoading: true });
    API.get(`${API_SERVER}v2/webinar/history/${this.state.webinarId}`).then(res => {
      if (res.data.error) toast.warning("Gagal fetch API");
      let peserta = res.data.result.peserta
      let pesertaDanTamu = peserta.concat(res.data.result.tamu)
      this.setState({
        id: this.state.webinarId,
        company_id: res.data.result.company_id,
        certificate_orientation: res.data.result.certificate_orientation,
        certificate_background: res.data.result.certificate_background,
        gambar: res.data.result.gambar,
        judul: res.data.result.judul,
        cert_topic: res.data.result.judul,
        isi: res.data.result.isi,
        tanggal: res.data.result.start_time,
        tanggalEnd: res.data.result.end_time,
        // projectId: res.data.result.projectId,
        dokumenId: res.data.result.dokumenId,
        status: res.data.result.status,
        peserta: pesertaDanTamu,
        jumlahTamu: res.data.result.tamu.length,
        jumlahPeserta: peserta.length,
        projectId: res.data.result.project_id,
        jumlahHadir: pesertaDanTamu.filter((item) => item.status == 2).length,
        jumlahTidakHadir: pesertaDanTamu.filter((item) => item.status != 2).length,
        isLoading: false
      })
      this.setState({ pembicara: [] })
      res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
      this.checkProjectAccess()
    })
  }

  fetchEssay() {
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/essay/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ hasilEssay: res.data.result })
        }
      }
    })
  }
  componentDidMount() {
    this.fetchData()
    this.fetchQNA()
    this.fetchPoll()
    this.fetchJawabanKuesioner()
    this.fetchJawabanTest()
    this.fetchEssay()
  }
  checkProjectAccess() {
    API.get(`${API_SERVER}v1/project-access/${this.state.projectId}/${Storage.get('user').data.user_id}`).then(res => {
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

  handleChangeChecked(e, item) {
    item['checked'] = e.target.checked;
  }

  checkAll(e) {
    let item = this.state.peserta
    if (this.state.filterPeserta === 'Hadir') {
      item = item.filter(item => item.status === 2)
    }
    else if (this.state.filterPeserta === 'Tidak Hadir') {
      item = item.filter(item => item.status !== 2)
    }
    item.map((item, index) => {
      item.checked = e.target.checked;
    })
    this.setState({ item, checkAll: e.target.checked })
  }

  clickAction(e, i, items) {
    let item = this.state.peserta
    if (this.state.checkAll) {
      item[i].checked = false;
    } else {
      item[i].checked = true;
    }
    this.setState({ item })

  }

  filterPeserta(e) {
    this.setState({ filterPeserta: e.target.value })
  }

  handleChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size <= 5000000) {
        this.setState({
          [e.target.id]: e.target.files[0],
          [`${e.target.id}_img`]: URL.createObjectURL(e.target.files[0]),
        });
      } else {
        e.target.value = null;
        toast.warning('File max 5MB')
      }
    }
  };
  handleChangeArr = (e) => {
    console.log('ALVINSSS', e.target)
    if (e.target.files[0]) {
      if (e.target.files[0].size <= 5000000) {
        let sign = this.state.sign;
        sign[e.target.getAttribute('data-index')][e.target.id] = e.target.files[0];
        sign[e.target.getAttribute('data-index')][`${e.target.id}_img`] = URL.createObjectURL(e.target.files[0]);
        this.setState({ sign: sign });
      } else {
        e.target.value = null;
        toast.warning('File max 5MB')
      }
    }
  };
  handleChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      let a = this.state;
      this.setState(a);
    });
  };
  handleChangeTextArr = (e) => {
    let sign = this.state.sign;
    sign[e.target.getAttribute('data-index')][e.target.name] = e.target.value;
    this.setState({ sign: sign });
  };

  onChangeForm = e => {
    // this.setState({ [e.target.id]: e.target.value }, () => {
    //   let a = this.state;
    //   this.setState(a);
    // });
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  modalSertifikat() {
    if (this.state.peserta.filter((item) => item.checked === true).length > 0) {
      this.fetchCompanyInfo();
      this.setState({ isModalSertifikat: true });
    }
    else {
      toast.warning('Please select the participant you want to make a certificate')
    }
  }

  sertifikat = () => {
    let check = this.state.sign.filter((x) =>
      x.cert_sign_name === '' || (x.signature === '' || x.signature === null) || x.cert_sign_title === ''
    ).length;
    if (check > 0) {
      toast.warning('Please fill signature name and signature image')
    }
    else {
      let items = this.state.peserta;
      let sertifikat = items.filter(e => { return e.checked }).map(e => {
        return {
          webinar_id: e.webinar_id,
          user_id: e.voucher ? e.voucher : e.user_id,
          email: e.email,
          nama: e.name,
          peserta: e.voucher ? 0 : 1
        }
      });

      let formData = new FormData();
      formData.append('webinar_id', items[0].webinar_id);
      formData.append('company_id', this.state.company_id);
      formData.append('cert_title', this.state.cert_title);
      formData.append('cert_subtitle', this.state.cert_subtitle);
      formData.append('cert_description', this.state.cert_description);
      formData.append('cert_topic', this.state.cert_topic);
      formData.append('cert_logo', this.state.cert_logo);
      formData.append('sign', JSON.stringify(this.state.sign));
      formData.append('certificate_background', this.state.certificate_background);
      formData.append('certificate_orientation', this.state.certificate_orientation);
      formData.append('peserta', JSON.stringify(sertifikat));
      this.state.sign.map((x) => {
        formData.append('signature', x.signature);
      })

      API.post(`${API_SERVER}v2/webinar/sertifikat`, formData).then(async (res) => {
        if (!res.data.error) {
          toast.success('Mengirim sertifikat kepada peserta');
          this.handleModal();
          setTimeout(async () => {
            this.fetchDataWithoutLoading();
          }, 10000)
        }
        // window.location.reload();
      });
    }
  }

  downloadPDF() {
    // var doc = new jsPDF();
    const doc = new jsPDF({
      orientation: "landscape"
    });
    doc.setFontSize(18);
    doc.text("Webinar Report", 120, 20);

    doc.setFontSize(11);
    doc.text("Title", 20, 30);
    doc.text(`: ${this.state.judul}`, 50, 30);
    doc.text("Speaker", 20, 35);
    doc.text(`: ${this.state.pembicara.toString()}`, 50, 35);
    doc.text("Time", 20, 40);
    doc.text(`: ${moment(this.state.tanggal).local().format('DD MMMM YYYY HH:mm')} - ${moment(this.state.tanggalEnd).local().format('DD MMMM YYYY HH:mm')}`, 50, 40);
    doc.text("Total Invitation", 20, 45);
    doc.text(`: ${this.state.jumlahHadir + this.state.jumlahTidakHadir}`, 50, 45);
    doc.text("Present", 20, 50);
    doc.text(`: ${this.state.jumlahHadir}`, 50, 50);
    doc.text("Not Present", 20, 55);
    doc.text(`: ${this.state.jumlahTidakHadir}`, 50, 55);

    doc.setFontSize(12);
    doc.text("Attendences", 20, 60);
    doc.autoTable({ html: '#table-peserta', startY: 65, styles: { fontSize: 8 } })
    doc.text("Questions", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({ html: '#table-pertanyaan', startY: doc.lastAutoTable.finalY + 15, styles: { fontSize: 8 } })
    doc.text("Poll", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({ html: '#table-poll', startY: doc.lastAutoTable.finalY + 15, styles: { fontSize: 8 } })
    doc.text("Questioner", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({ html: '#table-kuesioner', startY: doc.lastAutoTable.finalY + 15, styles: { fontSize: 8 } })
    doc.text("Pre Test & Post Test", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({ html: '#table-test', startY: doc.lastAutoTable.finalY + 15, styles: { fontSize: 8 } })

    doc.text("Essay", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({ html: '#table-essay', startY: doc.lastAutoTable.finalY + 15, styles: { fontSize: 8 } })

    doc.save(`${this.state.judul}.pdf`);
  }

  render() {

    // let access_project_admin = this.state.access_project_admin
    // const Lampiran = ({items}) => (
    //   <div className="row">
    //     {
    //       items.map((item, i) => (
    //         <div className="col-sm-12 mb-3" key={item.id}>
    //           <div className='border-disabled'>
    //             <div className="box-lampiran">
    //               <div className="title-head f-w-900 f-16 fc-skyblue">
    //                 {item.nama}
    //                 <Link to={item.url} className="float-right link-lampiran"><i className="fa fa-download"></i></Link>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))
    //     }
    //   </div>
    // );

    // let show = false;
    // const handleClose = () => {
    //   show = false
    // };
    // const handleShow = () => {
    //   show = true
    // };
    const Peserta = ({ items }) => {
      if (this.state.filterPeserta === 'Hadir') {
        items = items.filter(item => item.status === 2)
      }
      else if (this.state.filterPeserta === 'Tidak Hadir') {
        items = items.filter(item => item.status !== 2)
      }
      return (
        <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
          <table id="table-peserta" className="table table-striped">
            <thead>
              <tr>
                <th><input type="checkbox" checked={this.state.checkAll} onChange={(e) => this.checkAll(e)} /> Certificate</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Attendance</th>
                <th>Entry Hours</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Audio</th>
                <th>Camera</th>
              </tr>
            </thead>
            <tbody>
              {
                items.map((item, i) => {
                  let jamMl = new Date(item.jam_mulai);
                  let jamMulai = item.jam_mulai ? ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2) : '-';
                  let jamSl = new Date(this.state.tanggalEnd);
                  let diff = Math.abs(jamSl - jamMl);
                  let diffHour = Math.floor((diff % 86400000) / 3600000);
                  let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
                  let durasi = item.jam_mulai ? diffHour + ' hr ' + diffMin + ' min' : '-';

                  let audio = '';
                  if (item.audio !== 'Off') {
                    let splitAudio = item.audio.split(':');
                    audio = splitAudio.length > 2 ? `${pad(splitAudio[0])}:${pad(splitAudio[1])}:${pad(splitAudio[2])}` : `${pad(splitAudio[0])}:${pad(splitAudio[1])}`;
                  } else {
                    audio = item.audio;
                  }

                  let camera = '';
                  if (item.camera !== 'Off') {
                    let splitCamera = item.camera.split(':');
                    camera = splitCamera.length > 2 ? `${pad(splitCamera[0])}:${pad(splitCamera[1])}:${pad(splitCamera[2])}` : `${pad(splitCamera[0])}:${pad(splitCamera[1])}`;
                  } else {
                    camera = item.camera;
                  }

                  return (<tr key={i}>
                    {

                      (item.status == 2) ?
                        <td><input type="checkbox" id={i} checked={items[i].checked} onClick={(e) => this.clickAction(e, i, items[i])} onChange={(e) => this.handleChangeChecked(e, item)} /> {item.status_sertifikat ? 'Sent' : 'No'}</td>
                        :
                        <td><input type="checkbox" id={i} checked={null} onChange={(e) => this.handleChangeChecked(e, item)} disabled /> {item.status_sertifikat ? 'Sent' : 'No'}</td>
                    }
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.status == 2 ? 'Present' : 'Not present'}</td>
                    <td>{item.jam_mulai ? moment(jamMulai, 'HH:mm').local().format('HH:mm') : '-'}</td>
                    <td>{item.voucher ? 'Guest' : 'Participants'}</td>
                    <td>{durasi}</td>
                    <td>{audio}</td>
                    <td>{camera}</td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      )
    };

    const Pertanyaan = ({ items }) => (
      <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
        <table id="table-pertanyaan" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((item, i) => {
                return (<tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.jenis_peserta == 'tamu' ? 'Guest' : 'Participants'}</td>
                  <td>{item.description}</td>
                </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    );
    const Poll = ({ items }) => (
      <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
        <table id="table-poll" className="table table-striped">
          <thead>
            <tr>
              <th>No.</th>
              <th>Question</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((item, i) => {
                return (<tr key={i}>
                  <td>{i + 1}</td>
                  <td><div style={{ float: 'left' }} dangerouslySetInnerHTML={{ __html: item.tanya }} /></td>
                  <td>
                    {
                      item.answer.map((x, i) =>
                        <><div>{x.value} ( {x.percent}% )</div>{item.answer[i + 1] ? <br /> : ''}</>
                      )
                    }
                  </td>
                </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    );
    const JawabanKuesioner = ({ items }) => (
      <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'scroll', paddingRight: 10 }}>
        <table id="table-kuesioner" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              {
                items.pertanyaan.map((item) => (
                  <th key={item}>{item}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              items.jawaban.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.nama}</td>
                    {
                      item.jawaban.map((item) =>
                        <td key={item}>{item}</td>
                      )
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
    const HasilTest = ({ items, peserta }) => (
      <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'scroll', paddingRight: 10 }}>
        <table id="table-test" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pre Test Score</th>
              <th>Post Test Score</th>
              <th>Deviation</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(items).map(function (key, index) {
                return (
                  <tr>
                    <td>{items[key].name}</td>
                    <td>{items[key].pretest.nilai.toFixed(2)}</td>
                    <td>{items[key].posttest.nilai.toFixed(2)}</td>
                    <td>{items[key].selisih.toFixed(2)}</td>
                  </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    );

    const HasilEssay = ({ items }) => (
      <div className="wrap" style={{ marginTop: 10, maxHeight: 500, overflowY: 'scroll', overflowX: 'scroll', paddingRight: 10 }}>
        <table id="table-essay" className="table table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((item, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <div dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )

    const dataSelesai = {
      labels: [
        'Present',
        'Not Present',
      ],
      datasets: [{
        data: [this.state.jumlahHadir, this.state.jumlahTidakHadir],
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#FF6384',
        ]
      }]
    };
    const dataVia = {
      labels: [
        'User',
        'Guest',
      ],
      datasets: [{
        data: [this.state.jumlahPeserta, this.state.jumlahTamu],
        backgroundColor: [
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };

    const ModalDownloadFileWebinar = () => (
      <Modal
        show={this.state.isModalDownloadFileWebinar}
        onHide={this.handleModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
            Folder dan File Project Terkait
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: 500, overflowY: 'scroll' }} className="form-group">
            {/* <Lampiran items={this.state.lampiran} /> */}
            <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.state.projectId} />
          </div>
        </Modal.Body>
      </Modal>
    );

    return (
      <div className="row riwayat">
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    <Link onClick={this.backButton.bind(this)} className="btn btn-sm mr-4" style={{
                      border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                    }}>
                      <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                    </Link>
                    History
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              {
                this.state.isLoading ?
                  <div>Loading...</div>
                  :
                  <>
                    <div style={{ marginTop: '10px' }}>
                      <div className="row">
                        <div className="col-sm-8">
                          <h5 style={{ fontSize: 17 }}>{this.state.judul}</h5>
                          <h6>Speaker : {this.state.pembicara.toString()}</h6>
                          <p>
                            <div dangerouslySetInnerHTML={{ __html: this.state.isi }} />
                          </p>
                          <h6>{moment(this.state.tanggal).local().format('DD MMMM YYYY HH:mm')} - {moment(this.state.tanggalEnd).local().format('DD MMMM YYYY HH:mm')}</h6>
                        </div>

                        <div className="col-sm-4">
                          <button
                            className="btn btn-icademy-primary btn-12"
                            onClick={this.downloadPDF.bind(this)}
                            style={{ marginRight: 14 }}
                          >
                            <i className="fa fa-file-pdf"></i>
                            Download PDF Report
                          </button>
                          <button
                            className="btn btn-icademy-primary btn-12"
                            onClick={e => this.setState({ isModalDownloadFileWebinar: true })}
                            style={{ marginRight: 14 }}
                          >
                            <i className="fa fa-folder"></i>
                            Files
                          </button>
                          {/* <Link to={`/webinar/kuesioner/${this.props.match.params.webinarId}`} >
                        <button
                          className="btn btn-icademy-primary"
                        >
                          <i className="fa fa-file"></i>
                          Feedback Form
                        </button></Link> */}
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-sm-4">
                        <Doughnut data={dataSelesai} />
                      </div>
                      <div className="col-sm-4">
                        <Doughnut data={dataVia} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-peserta"
                          filename={'Attendance ' + this.state.judul}
                          sheet="Attendance"
                          buttonText="Export Attendance to Excel" />
                        <div className="wrap float-right" style={{ width: 400 }}>
                          <select name="filterPeserta" value={this.state.filterPeserta} className="form-control" style={{ fontSize: 12, width: 'auto', float: 'right' }} onChange={(e) => this.filterPeserta(e)}>
                            <option value="Semua" selected> All</option>
                            <option value="Hadir"> Present</option>
                            <option value="Tidak Hadir"> Not Present</option>
                          </select>
                          <Button className="btn btn-icademy-primary btn-12" style={{ float: 'right', marginRight: '20px' }} onClick={this.modalSertifikat.bind(this)}>Create Certificate</Button>
                        </div>
                        <Peserta items={this.state.peserta} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-pertanyaan"
                          filename={'Questions ' + this.state.judul}
                          sheet="Questions"
                          buttonText="Export Questions to Excel" />
                        <Pertanyaan items={this.state.qna} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-poll"
                          filename={'Poll ' + this.state.judul}
                          sheet="Questions"
                          buttonText="Export Poll to Excel" />
                        <Poll items={this.state.poll} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-kuesioner"
                          filename={'Feedback Form Result ' + this.state.judul}
                          sheet="Feedback Form"
                          buttonText="Export Feedback Form to Excel" />
                        <JawabanKuesioner items={this.state.jawabanKuesioner} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-test"
                          filename={'Test Result ' + this.state.judul}
                          sheet="Test"
                          buttonText="Export Test Result to Excel" />
                        <HasilTest items={this.state.hasilTest} peserta={this.state.peserta} />
                      </div>
                    </div>

                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <ReactHTMLTableToExcel
                          className="btn btn-icademy-warning btn-12"
                          table="table-essay"
                          filename={'Test Result ' + this.state.judul}
                          sheet="Test"
                          buttonText="Export Essay Result to Excel" />
                        <HasilEssay items={this.state.hasilEssay} />
                      </div>
                    </div>
                  </>
              }
            </Card.Body>
          </Card>

          <ModalDownloadFileWebinar />
          <Modal
            show={this.state.isModalSertifikat}
            onHide={this.handleModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Create Certificate
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <div className="certificate-view" style={{ height: this.state.certificate_orientation === 'landscape' ? 'auto' : '750px', width: this.state.certificate_orientation === 'landscape' ? '750px' : '600px', padding: '10px', textAlign: 'center', border: '3px solid #787878', fontSize: '25px', position: 'relative', margin: 'auto' }}>
                    {
                      this.state.certificate_background ?
                        <img src={this.state.certificate_background} style={{ width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px', zIndex: '0' }} />
                        : null
                    }
                    <div style={{ height: this.state.certificate_orientation === 'landscape' ? 'auto' : '730px', width: this.state.certificate_orientation === 'landscape' ? '724px' : '574px', padding: '10px', textAlign: 'center', border: this.state.certificate_background ? '' : '1px solid #787878', position: 'relative', paddingTop: this.state.certificate_orientation === 'landscape' ? '10px' : '100px' }}><br />

                      <label for='cert_logo' style={{ display: 'block' }}>
                        <span style={{ position: 'relative' }}>
                          <img style={{ height: '75px', cursor: 'pointer' }} src={this.state.cert_logo == '' || this.state.cert_logo == null ? this.state.companyLogo : typeof this.state.cert_logo === 'object' && this.state.cert_logo !== null ? URL.createObjectURL(this.state.cert_logo) : this.state.cert_logo} />
                          <i className="fa fa-edit" style={{ fontSize: 14, position: 'absolute', right: 0 }}></i>
                        </span>
                      </label>
                      <input type="file" style={{ display: 'none', cursor: 'pointer' }} id="cert_logo" name="cert_logo" onChange={this.handleChange} className="ml-5 btn btn-sm btn-default" />
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        <input type='text' name='cert_title' onChange={this.handleChangeText} style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center', fontWeight: 'bold' }} value={this.state.cert_title} />
                      </span>
                      <br /><br />
                      <span style={{ fontSize: '15px' }}>
                        <input type='text' onChange={this.handleChangeText} name='cert_subtitle' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} value={this.state.cert_subtitle} />
                      </span>
                      <br /><br />
                      <span style={{ fontSize: '20px' }}><b>[Name]</b></span><br /><br />
                      <span style={{ fontSize: '15px' }}>
                        <input type='text' onChange={this.handleChangeText} name='cert_description' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} value={this.state.cert_description} />
                      </span> <br /><br />
                      <span style={{ fontSize: '18px' }}><b><input type='text' onChange={this.handleChangeText} name='cert_topic' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} value={this.state.cert_topic} /></b></span> <br /><br />
                      <span style={{ fontSize: '10px' }}>{moment(this.state.tanggal).local().format('dddd, MMMM Do YYYY')}</span><br />
                      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {
                          this.state.sign.map((item, index) =>
                            <span>
                              <label style={{ display: 'block', cursor: 'pointer' }}>
                                <span style={{ position: 'relative' }}>
                                  <img style={{ height: '80px' }} src={this.state.sign[index].signature == '' || this.state.sign[index].signature == null ? `/newasset/imginput.png` : typeof this.state.sign[index].signature === 'object' && this.state.sign[index].signature !== null ? URL.createObjectURL(this.state.sign[index].signature) : this.state.sign[index].signature} />
                                  <i className="fa fa-edit" style={{ fontSize: 14, position: 'absolute', right: 0 }}></i>
                                </span>
                                <input type="file" style={{ display: 'none', cursor: 'pointer' }} id="signature" name="signature" onChange={this.handleChangeArr} data-index={index} className="ml-5 btn btn-sm btn-default" />
                              </label>
                              <span style={{ fontSize: '12px' }}>
                                <input type='text' onChange={this.handleChangeTextArr} data-index={index} name='cert_sign_name' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} placeholder='Name' value={this.state.sign[index].cert_sign_name} />
                              </span>
                              <span style={{ fontSize: '12px' }}>
                                <input type='text' onChange={this.handleChangeTextArr} data-index={index} name='cert_sign_title' style={{ width: '80%', border: 'none', borderBottom: '1px dashed #CCC', textAlign: 'center' }} placeholder='Title' value={this.state.sign[index].cert_sign_title} />
                              </span>
                            </span>
                          )
                        }
                      </div>
                      <br /><br />
                      {
                        this.state.sign.length < 3 ?
                          <span style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => { this.state.sign.push({ cert_sign_name: '', cert_sign_title: '', signature: '' }); this.forceUpdate(); }}>+ Add Signature</span>
                          : null
                      }
                    </div>
                  </div>
                </Form.Group>
              </Form>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-icademy-primary" onClick={() => this.sertifikat()}>
                Send Certificate to Selected Participant's Email
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
