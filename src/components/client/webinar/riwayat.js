import React, { Component } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {Doughnut} from 'react-chartjs-2';

export default class WebinarRiwayat extends Component {

	state = {
    peserta: [
      {nama: 'Ahmad', status: 'Selesai', jam_mulai: '08:01', jam_selesai: '09:01', via: 'Voucher', durasi: '1 Jam'},
      {nama: 'Ardiansyah', status: 'Selesai', jam_mulai: '08:00', jam_selesai: '09:00', via: 'Login', durasi: '1 Jam'},
    ],
  }

	render() {

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
    }, dataVia = {
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
		
    return (
			<div className="row">                     
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                  	<Link to="/webinar" className="btn btn-sm mr-4" style={{
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
                    <Link to="" className="btn btn-primary btn-v2"><i className="fa fa-download"></i> Download File Webinar</Link>
                    <Link to="" className="btn btn-primary btn-v2"><i className="fa fa-download"></i> Hasil Kuesioner Peserta</Link>
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
        </div>
      </div>
		);
	}
}