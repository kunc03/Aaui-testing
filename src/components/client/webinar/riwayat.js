import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import { Link } from 'react-router-dom';
import Moment from 'moment-timezone';
import { toast } from "react-toastify";
import TableFiles from '../../Home_new/detail_project/files';
import Storage from './../../../repository/storage';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import {Doughnut} from 'react-chartjs-2';

export default class WebinarRiwayat extends Component {

	state = {
    webinarId: this.props.match.params.webinarId,
    pesertaX: [
      {nama: 'Ahmad', status: 'Selesai', jam_mulai: '08:01', jam_selesai: '09:01', via: 'Voucher', durasi: '1 Jam'},
      {nama: 'Ardiansyah', status: 'Selesai', jam_mulai: '08:00', jam_selesai: '09:00', via: 'Login', durasi: '1 Jam'},
    ],
    peserta: [],
    lampiran: [
      {id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com'},
      {id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com'},
      {id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com'},
    ],

    isModalDownloadFileWebinar: false,
    access_project_admin: false,
    jumlahHadir: 0,
    jumlahTidakHadir: 0,
    qna: [],
    jawabanKuesioner:[]
  }

  fetchQNA(){
    API.get(`${API_SERVER}v2/webinar/qna/${this.state.webinarId}`).then(res => {
      if (res.data.error)
          toast.warning("Error fetch API")
      else
        this.setState({qna: res.data.result})
    })
  }
  fetchJawabanKuesioner(){
    API.get(`${API_SERVER}v2/kuesioner/result/${this.state.webinarId}`).then(res => {
      if (res.data.error)
          toast.warning("Error fetch API")
      else
        this.setState({jawabanKuesioner: res.data.result})
    })
  }

  backButton(){
    this.props.history.goBack();
  }
  
  handleModal = () => {
    this.setState({
      isModalDownloadFileWebinar: false
    });
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar/history/${this.state.webinarId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      let peserta = res.data.result.peserta
      let pesertaDanTamu = peserta.concat(res.data.result.tamu)
      this.setState({
        id: this.state.webinarId,
        gambar: res.data.result.gambar,
        judul: res.data.result.judul,
        isi: res.data.result.isi,
        tanggal: Moment.tz(res.data.result.tanggal, 'Asia/Jakarta').format("DD MMMM YYYY"),
        jamMulai: res.data.result.jam_mulai,
        jamSelesai: res.data.result.jam_selesai,
        projectId: res.data.result.projectId,
        dokumenId: res.data.result.dokumenId,
        pembicara: res.data.result.pembicara.name,
        status: res.data.result.status,
        peserta: pesertaDanTamu,
        jumlahTamu: res.data.result.tamu.length,
        jumlahPeserta: peserta.length,
        projectId: res.data.result.project_id,
        jumlahHadir: pesertaDanTamu.filter((item) => item.status == 2).length,
        jumlahTidakHadir: pesertaDanTamu.filter((item) => item.status != 2).length
      })
    })
  }
  componentDidMount(){
    this.fetchData()
    this.fetchQNA()
    this.checkProjectAccess()
  }
  checkProjectAccess(){
    API.get(`${API_SERVER}v1/project-access/${this.state.projectId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client' ){
          this.setState({
            access_project_admin: true,
          })
        }
        else{
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }
	render() {

    // let access_project_admin = this.state.access_project_admin
    const Lampiran = ({items}) => (
      <div className="row">
        {
          items.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.id}>
              <div className='border-disabled'>
                <div className="box-lampiran">
                  <div className="title-head f-w-900 f-16 fc-skyblue">
                    {item.nama} 
                    <Link to={item.url} className="float-right link-lampiran"><i className="fa fa-download"></i></Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );

    const Peserta = ({items}) => (
      <div className="wrap" style={{marginTop:10, maxHeight:500, overflowY:'scroll', overflowX:'hidden', paddingRight:10}}>
      <table id="table-peserta" className="table table-striped">
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Kehadiran</th>
            <th>Jam Masuk</th>
            <th>Status</th>
            <th>Durasi</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, i) => {
              let jamMl = new Date(item.jam_mulai);
              let jamMulai = item.jam_mulai ? ('0' + jamMl.getHours()).slice(-2)+':'+('0' + jamMl.getMinutes()).slice(-2) : '-';
              let jamSl = new Date(this.state.tanggal + ' ' + this.state.jamSelesai);
              let diff = Math.abs(jamSl - jamMl);
              let diffHour = Math.floor((diff % 86400000) / 3600000);
              let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
              let durasi = item.jam_mulai ? diffHour + ' Jam ' + diffMin + ' Menit' : '-';
              return (<tr>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.status == 2 ? 'Hadir' : 'Tidak Hadir'}</td>
                <td>{jamMulai}</td>
                <td>{item.voucher ? 'Tamu' : 'Peserta'}</td>
                <td>{durasi}</td>
              </tr>)
            })
          }
        </tbody>
      </table>
      </div>
    );

    const Pertanyaan = ({items}) => (
      <div className="wrap" style={{marginTop:10, maxHeight:500, overflowY:'scroll', overflowX:'hidden', paddingRight:10}}>
      <table id="table-pertanyaan" className="table table-striped">
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Pertanyaan</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, i) => {
              return (<tr>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.jenis_peserta == 'tamu' ? 'Tamu' : 'Peserta'}</td>
                <td>{item.description}</td>
              </tr>)
            })
          }
        </tbody>
      </table>
      </div>
    );

    const dataSelesai = {
      labels: [
        'Hadir',
        'Tidak Hadir',
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
        'Peserta',
        'Tamu',
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
          <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Folder dan File Project Terkait
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight:500, overflowY:'scroll' }} className="form-group">
            {/* <Lampiran items={this.state.lampiran} /> */}
            <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.state.projectId}/>
          </div>
        </Modal.Body>
      </Modal>
    );
		
    return (
			<div className="row">                     
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
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link>
                    Riwayat
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="row">
                  <div className="col-sm-10">
                    <h5>{this.state.judul}</h5>
                    <h6>Pembicara : {this.state.pembicara}</h6>
                    <p>
                     {this.state.isi}
                    </p>
                    <h6>{this.state.tanggal}, &nbsp; {this.state.jamMulai} - {this.state.jamSelesai}</h6>
                  </div>

                  <div className="col-sm-2">
                      <button
                        className="btn btn-icademy-primary"
                        onClick={e => this.setState({ isModalDownloadFileWebinar: true }) }
                        style={{marginRight:14}}
                      >
                        <i className="fa fa-folder"></i>
                        Files
                      </button>
                    {/* <Link to={`/webinar/kuesioner/${this.props.match.params.webinarId}`} >
                      <button
                        className="btn btn-icademy-primary"
                      >
                        <i className="fa fa-file"></i>
                        Kuesioner
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
                    className="btn btn-icademy-warning"
                    table="table-peserta"
                    filename={'Kehadiran '+this.state.judul}
                    sheet="Kehadiran"
                    buttonText="Export Kehadiran Peserta ke Excel"/>
                  <Peserta items={this.state.peserta} />
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-sm-12">
                <ReactHTMLTableToExcel
                    className="btn btn-icademy-warning"
                    table="table-pertanyaan"
                    filename={'Pertanyaan '+this.state.judul}
                    sheet="Kehadiran"
                    buttonText="Export Pertanyaan ke Excel"/>
                  <Pertanyaan items={this.state.qna} />
                </div>
              </div>

            </Card.Body>
          </Card>

          <ModalDownloadFileWebinar />
        </div>
      </div>
		);
	}
}