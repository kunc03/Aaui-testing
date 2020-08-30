import React, { Component } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WebinarAdd extends Component {

	state = {}

	render() {
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
                    Buat Webinar
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
                    <div className="form-group">
                      <label className="bold">Gambar Webinar</label>
                      <div className="row">
                        <div className="col-sm-4">
                          <img src="/newasset/imginput.png" width="300px" />
                        </div>
                        <div className="col-sm-2">
                          <input type="file" className="ml-5 btn btn-sm btn-default" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="bold">Judul Webinar</label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                      <label className="bold">Isi Webinar</label>
                      <textarea rows="6" className="form-control"></textarea>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="bold">Tanggal Webinar</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Mulai</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Selesai</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="bold">Pembicara</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-sm-6">
                        <label className="bold">Peserta</label>
                        <div class="input-group">
                          <input type="text" className="form-control" />
                          <span className="input-group-btn">
                            <button className="btn btn-default">
                                <i className="fa fa-plus"></i> Tambah
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="bold">Role Dokumen Tree</label>
                        <a style={{padding: '18px'}} href="#" className="form-control btn-primary"><i className="fa fa-file"></i> Folder Dokumen Tree</a>
                      </div>
                    </div>

                    <div className="form-group row">
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
                    </div>

                    <div className="form-group">
                      <button className="btn btn-success"><i className="fa fa-save"></i> Simpan</button>
                    </div>

                  </div>
                </div>
                
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
		);
	}
}