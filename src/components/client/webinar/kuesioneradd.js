import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WebinarKuesionerAdd extends Component {

	state = {
    pertanyaan: [
      {
        tanya: 'Bagaimana pendapat Anda tentang pembicara ?', 
        a: 'Sangat Bagus',
        b: 'Bagus',
        c: 'Cukup Bagus',
      },
    ],
  }

  onClickTambahPertanyaan = () => {
    let baruPertanyaan = {
      tanya: '', 
      a: '',
      b: '',
      c: ''
    };
    this.setState({
      pertanyaan: [...this.state.pertanyaan, baruPertanyaan]
    })
  }

  handleDynamicInput = (e, i) => {
    const { value, name } = e.target;
    let newObj = [...this.state.pertanyaan];

    newObj[i][name] = value;
    this.setState({ pertanyaan: newObj });
  }

  onClickHapusPertanyaan = (e) => {
    let kurangi = this.state.pertanyaan.filter((item, i) => i !== parseInt(e.target.getAttribute('data-index')));
    this.setState({
      pertanyaan: kurangi
    })
  }

	render() {

    const DaftarPertanyaan = ({items}) => (
      <div>
        {
          items.map((item,i) => (
            <div className="form-group">
              <label>Pertanyaan {i+1}</label>
              <span className="float-right">
                <i data-index={i} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
              </span>
              <textarea onChange={e => this.handleDynamicInput(e, i)} name="tanya" className="form-control" rows="3" value={item.tanya} />

              <div className="jawaban mt-3 ml-4">
                <label>Tambahkan Jawaban Kuesioner</label>
                <tr>
                  <td>
                    A
                  </td>
                  <td>
                    <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.a} className="form-control" style={{width: '460px'}} />
                  </td>
                </tr>
                <tr>
                  <td>
                    B
                  </td>
                  <td>
                    <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{width: '460px'}} />
                  </td>
                </tr>
                <tr>
                  <td>
                    C
                  </td>
                  <td>
                    <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{width: '460px'}} />
                  </td>
                </tr>
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
                    Buat Kuesioner
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
                  <div className="col-sm-12">
                    
                    <button className="btn btn-v2 btn-primary"><i className="fa fa-upload"></i> Import from excel</button>
                
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-sm-8">

                    {
                      this.state.pertanyaan.map((item,i) => (
                        <div className="form-group">
                          <label>Pertanyaan {i+1}</label>
                          <span className="float-right">
                            <i data-index={i} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                          </span>
                          <textarea onChange={e => this.handleDynamicInput(e, i)} name="tanya" className="form-control" rows="3" value={item.tanya} />

                          <div className="jawaban mt-3 ml-4">
                            <label>Tambahkan Jawaban Kuesioner</label>
                            <tr>
                              <td>
                                A
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="a" value={item.a} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                B
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                C
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                          </div>
                        </div>
                      ))
                    }

                    <button onClick={this.onClickTambahPertanyaan} className="btn btn-v2 btn-block btn-primary"><i className="fa fa-plus"></i> Tambah Pertanyaan</button>                    
                    
                    <button className="btn btn-v2 btn-block btn-success"><i className="fa fa-save"></i> Simpan Semua Pertanyaan</button>                    

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