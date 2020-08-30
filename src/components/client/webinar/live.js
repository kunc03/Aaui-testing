import React, { Component } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WebinarLive extends Component {

	state = {
    judul: 'ReactJS for Project',
    pembicara: 'Ahmad Ardiansyah',
    deskripsi: `
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
    `,

    lampirans: [
      {id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com'},
      {id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com'},
      {id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com'},
    ],
    pertanyaans: [
      {id: 1, dari: 'John MC', pertanyaan: 'Berapa hasil dari 10x10 berapa hayooo?', datetime: '02 Sep 2020 12:10'},
      {id: 2, dari: 'Arrazaqul', pertanyaan: 'Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12'},
      {id: 3, dari: 'Ahmad Syujan', pertanyaan: 'Gan, Saya yang mau tanya lebih serius. Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12'},
    ]
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

    const Pertanyaan = ({items}) => (
      <div className="row">
        {
          items.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.id}>
              <div className='border-disabled'>
                <div className="box-lampiran">
                  <div className="">
                    <span style={{fontWeight: 'bold'}}>{item.dari}</span>
                    <span className="float-right">{item.datetime}</span> 
                    <br/>
                    <p style={{marginBottom: '1px'}}>
                    {item.pertanyaan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );

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
                    {this.state.judul}
                    <p style={{margin: '-12px 0 0 76px'}}>Pembicara : {this.state.pembicara}</p>
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="row">
                  <div className="col-sm-12">
                    <img src="/newasset/jitsi.jpg" className="img-fluid" />

                    <div className="dekripsi" style={{marginTop: '20px'}}>
                      <h4>Deskripsi</h4>
                      <div dangerouslySetInnerHTML={{ __html: this.state.deskripsi }} />
                    </div>
                  </div>

                </div>
                
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-sm-6">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    Lampiran
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <Lampiran items={this.state.lampirans} />
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-sm-6">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    Pertanyaan
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <Pertanyaan items={this.state.pertanyaans} />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
		);
	}
}
