import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {Doughnut} from 'react-chartjs-2';

export default class WebinarRiwayat extends Component {

	state = {
    peserta: [
      {nama: 'Ahmad', status: 'Selesai', jam_mulai: '08:01', jam_selesai: '09:01', via: 'Voucher', durasi: '1 Jam'},
      {nama: 'Ardiansyah', status: 'Selesai', jam_mulai: '08:00', jam_selesai: '09:00', via: 'Login', durasi: '1 Jam'},
    ],
    lampiran: [
      {id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com'},
      {id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com'},
      {id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com'},
    ],

    isModalDownloadFileWebinar: false
  }

  handleModal = () => {
    this.setState({
      isModalDownloadFileWebinar: false
    });
  }

	render() {

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
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Status</th>
            <th>Jam Mulai</th>
            <th>Jam Selesai</th>
            <th>Via</th>
            <th>Durasi</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, i) => (
              <tr>
                <td>{item.nama}</td>
                <td>{item.status}</td>
                <td>{item.jam_mulai}</td>
                <td>{item.jam_selesai}</td>
                <td>{item.via}</td>
                <td>{item.durasi}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const dataSelesai = {
      labels: [
        'Selesai',
        'Belum Selesai',
      ],
      datasets: [{
        data: [2, 1],
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        ]
      }]
    };
    const dataVia = {
      labels: [
        'Voucher',
        'Login',
      ],
      datasets: [{
        data: [1, 2],
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
      >
        <Modal.Body>
          <h5>
            File Webinar
          </h5>

          <div style={{ marginTop: "20px" }} className="form-group">
            <Lampiran items={this.state.lampiran} />
          </div>
          
          <button
            type="button"
            className="btn btn-v2 btn-primary f-w-bold mr-2"
          >
            <i className="fa fa-download"></i>
            Download Semua File
          </button>
          <button
            type="button"
            className="btn btn-v2 f-w-bold"
            onClick={this.handleModal}
          >
            Tutup
          </button>
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
                  	<Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
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
                  <div className="col-sm-8">
                    <h5>Trik Jitu Marketing</h5>
                    <h6>Pembicara : Ahmad Ardiansyah</h6>
                    <p>
                      Untuk mengakomodasi proses work from home (WFH), diperlukan media untuk berkoordinasi 
                      di dalam sebuah team secara online, sehingga team work bisa tetap terjaga dengan baik. 
                      Aplikasi Video Conference adalah salah satu dari media yang sangat diperlukan, untuk 
                      menunjang proses koordinasi secara online tersebut.
                      Untuk mengakomodasi proses work from home (WFH), diperlukan media untuk berkoordinasi 
                      di dalam sebuah team secara online, sehingga team work bisa tetap terjaga dengan baik. 
                      Aplikasi Video Conference adalah salah satu dari media yang sangat diperlukan, untuk 
                      menunjang proses koordinasi secara online tersebut.
                    </p>
                    <h6>02 Sep 2020 &nbsp; 08:00 AM - 09:00 AM</h6>
                  </div>

                  <div className="col-sm-4">
                    <h5>Lampiran</h5>
                    <button onClick={e => this.setState({ isModalDownloadFileWebinar: true }) } className="btn btn-primary btn-v2"><i className="fa fa-download"></i> Download File Webinar</button>
                    <Link to={`/webinar/kuesioner/${this.props.match.params.projectId}`} className="btn btn-primary btn-v2"><i className="fa fa-download"></i> Hasil Kuesioner Peserta</Link>
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
                  <Link to="" className="btn btn-primary btn-v2"><i className="fa fa-download"></i> Export To Excel</Link>
                  <Peserta items={this.state.peserta} />
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