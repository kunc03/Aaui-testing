import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Card, Button } from "react-bootstrap";

export default class HasilUjianKursus extends Component {

	state = {
    durasiWaktu: 10 * (60 * 1000),
    jumlahSoal: 15,
    isOpenModal: false,
    setAnswer : false,
    stateAkhir: Date.now() + 10 * (60 * 1000),
	}

	componentDidMount() {
    if(Date.now() < this.state.stateAkhir) {
      if(localStorage.getItem('waktuUjian') === null) {
        localStorage.setItem('waktuUjian', this.state.durasiWaktu);
        console.log('awal: ', parseInt(localStorage.getItem('waktuUjian')) );
      } else {
        this.setState({ durasiWaktu: parseInt(localStorage.getItem('waktuUjian')) })
        console.log('exist: ', parseInt(localStorage.getItem('waktuUjian')) );
      }
    } else {
      this.resetCountDown()      
    }
  }

  checkLocalStorage = e => {
    console.log('cek: ', localStorage.getItem('key: DOMString'))
  }

  resetCountDown = e => {
    localStorage.removeItem('waktuUjian')
    console.log('reset: ', localStorage.getItem('waktuUjian'))
  }

  onTickCountDown = e => {
    localStorage.setItem('waktuUjian', e.total);
  }

  onFinisCountDown = e => {
    this.resetCountDown();
  }

  submitModalConfirm(){
    this.setState({
      isOpenModal : true
    })
  }

  closeModalConfirm = e => {
    this.setState({ isOpenModal: false })
  }

  checkResult(value, index){
    console.log(index);
    this.setState({setAnswer: true})
  }

  render() {
    const { durasiWaktu, jumlahSoal, setAnswer } = this.state;
    const Completionist = () => <span>You are good to go!</span>;

    let number = [];
    for(let i = 1; i < 15; i++){
        number.push({no: i, color: i % 2 === 0 ? '#8F0101' : '#259457'})
    }
   // console.log(number)

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  
                  <div className="row">
                    <div className="col-sm-6">
                     

                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-3 text-center">
                              <h3 className="f-24 f-w-800 mb-3" style={{marginTop: '24px'}}>UJIAN</h3>
                            </div>
                            <div className="col-sm-9">
                              <table>
                                <tr>
                                  <td colSpan="2">
                                    Teknologi
                                  </td>
                                </tr>  
                                <tr>
                                  <td colSpan="2">
                                    <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>Bagaimana menjadi seorang Developer?</h3>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-12 text-center">
                                <ul class="flex-container"  style={{marginTop: '16px'}}>
                                    {number.map((item, index) => {
                                        return ( 
                                            <li class="flex-item" onClick={this.checkResult.bind(this, item, index)}style={{backgroundColor: item.color, color:'#fff'}}>{item.no}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                          </div>

                          <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-sm-12 text-center">    
                              <Button className="btn btn-block btn-info" onClick={this.submitModalConfirm.bind(this)}>Selesai</Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    {/* MODAL CONFIRM */}
                    <Modal show={this.state.isOpenModal} onHide={this.closeModalConfirm}>
                    <Modal.Body style={{padding: '30px'}}>
                      
                      <h4 style={{marginTop: '30px', fontWeight: 'bold', color:'pink'}}>
                        SELESAI UJIAN
                      </h4>
                      <h5 className=" f-w-800 mb-3">Apakah Anda Yakin Untuk Melajutkan Ke Menu Home ?</h5>

                      <Link style={{marginTop: '20px'}} to={`/`} className="btn btn-block btn-ideku f-w-bold">
                        Iya
                      </Link>
                      <button type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.closeModalConfirm}>
                        Tidak
                      </button>
                    </Modal.Body>
                  </Modal>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                        <div style={{backgroundImage : 'url(/assets/images/component/hasil.png)', height : setAnswer ? '22vh' : '42vh', backgroundRepeat: 'no-repeat', backgroundSize:'contain', backgroundPosition: 'center', marginBottom: '32px'}}>
                            <div style={{textAlign: 'center', position: 'relative', top: setAnswer ? '50%' : '52%', left: setAnswer ? '-7%' : '-14%'}}>
                                <p className="text-c-white f-19 f-w-400"><b>NILAI UJIAN</b></p>
                                <h1 className="text-c-white f-w-600" style={{fontSize : setAnswer ? '45px' : '100px'}}><b>65</b></h1>
                            </div>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <span> 
                                <img src="/assets/images/component/clockkecil.png" style={{marginRight: '8px'}} /> 
                                <b style={{color:'red'}}>00:00:05:23</b>
                            </span> &nbsp; &nbsp; 
                            <span> 
                                <img src="/assets/images/component/questionkecil.png" style={{marginRight: '8px'}} /> 
                                <b style={{color:'blue'}}>35/100</b>
                            </span>
                        </div>
                        </Card.Body>
                      </Card>
                     {setAnswer ? 
                        <div> 
                            <Card>
                                <Card.Body>
                                <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>
                                    1. Bagaimana menjadi seorang Developer, Bagaimana menjadi seorang Developer, Bagaimana menjadi seorang Developer?
                                </h3>

                                <Card className="card-options">
                                    <Card.Body style={{padding: '16px'}}>
                                    A. Jawaban A
                                    </Card.Body>
                                </Card>

                                <Card className="card-options">
                                    <Card.Body style={{padding: '16px'}}>
                                    A. Jawaban A
                                    </Card.Body>
                                </Card>

                                <Card className="card-options">
                                    <Card.Body style={{padding: '16px'}}>
                                    A. Jawaban A
                                    </Card.Body>
                                </Card>

                                <Card className="card-options">
                                    <Card.Body style={{padding: '16px'}}>
                                    A. Jawaban A
                                    </Card.Body>
                                </Card>

                                </Card.Body>
                            </Card>
                        </div>
                        
                        : null
                    }
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
		);
	}

}