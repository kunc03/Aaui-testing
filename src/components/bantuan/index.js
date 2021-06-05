import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel';
import API, { USER_ME, API_SERVER } from '../../repository/api';

import {
  Presentation, Slide, Text,
  Shape, Image, render
} from "react-pptx";
import fs from "fs";

const gambar1 = [
  { image1: 'pic (1).jpg' }, { image1: 'pic (2).jpg' }, { image1: 'pic (3).jpg' }, { image1: 'pic (4).jpg' },
  { image1: 'pic (5).jpg' }, { image1: 'pic (6).jpg' }, { image1: 'pic (7).jpg' }, { image1: 'pic (8).jpg' },
  { image1: 'pic (9).jpg' }, { image1: 'pic (10).jpg' }, { image1: 'pic (11).jpg' }, { image1: 'pic (12).jpg' },
  { image1: 'pic (13).jpg' }, { image1: 'pic (14).jpg' }
]

const gambar2 = [
  { image1: 'pic (15).jpg' }, { image1: 'pic (16).jpg' }, { image1: 'pic (17).jpg' }, { image1: 'pic (18).jpg' },
  { image1: 'pic (19).jpg' }, { image1: 'pic (20).jpg' }, { image1: 'pic (21).jpg' }, { image1: 'pic (22).jpg' },
  { image1: 'pic (23).jpg' }, { image1: 'pic (24).jpg' }
]

const gambar3 = [
  { image1: 'pic (25).jpg' }, { image1: 'pic (26).jpg' }, { image1: 'pic (27).jpg' }, { image1: 'pic (28).jpg' },
  { image1: 'pic (29).jpg' }, { image1: 'pic (30).jpg' }, { image1: 'pic (31).jpg' }
]

class ClassBantuan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      one: true,
      two: false,
      three: false,
      fileData1 : [],
      fileData2 : [],
      fileData3 : [],
      fileDataPPT : []
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
    });
  }

  componentDidMount(){
    this.getFileJadwalAdmin();
  }

  getFileJadwalAdmin(companyId) {
    API.get(`${API_SERVER}v3/bantuan/all-file`).then(res => {
      if (res.status === 200) {
        this.setState({ 
          fileData1: res.data.result.filter(function (item){return item.tag === 'jadwal-admin'}),
          fileData2: res.data.result.filter(function (item){return item.tag === 'guru-murid'}),
          fileData3: res.data.result.filter(function (item){return item.tag === 'kurikulum-jadwal'}),
          fileDataPPT :  res.data.result.filter(function (item){return item.tag === 'ppt-jadwal'})[0]
        });
      }
    })
  }

  tabChoice(a) {
    if (a === 'one') {
      this.setState({
        one: true,
        two: false,
        three: false
      })
    } else if (a === 'two') {
      this.setState({
        one: false,
        two: true,
        three: false
      })
    } else if (a === 'three') {
      this.setState({
        one: false,
        two: false,
        three: true
      })
    }
  }

  render() {
    
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">

              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-block">
                          <h3 className="f-w-bold f-18 fc-blue mb-4">BANTUAN</h3>
                          <div className="row m-b-100">

                            <div className="col-sm-12">
                              <h3 className="f-w-bold f-18 fc-blue mb-4">LEARNING</h3>

                              <div className="col-sm-12">
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, 'one')}>
                                  <span className={this.state.one ? 'fc-skyblue' : ''}>Cara Memasukan Jadwal di Admin</span>
                                </div>
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, 'two')}>
                                  <span className={this.state.two ? 'fc-skyblue' : ''}>Cara Memasukan Materi di Guru</span>
                                </div>
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, 'three')}>
                                  <span className={this.state.three ? 'fc-skyblue' : ''}>Cara Membuat Kelas</span>
                                </div>
                              </div>

                              <h3 className="f-w-bold f-18 fc-blue mb-4">TRAINING</h3>

                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="col-sm-8">
                      <div className="card">
                         {/* <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=https://icademys.s3.ap-southeast-1.amazonaws.com/staging/bantuan/jadwal-admin.pptx`} width="402" height="327" frameborder="0" scrolling="no"></iframe> */}

                        <div className="card-block">

                          <h3 className="f-w-bold f-18 fc-blue mb-4" style={{ textAlign: 'center' }}>
                            {this.state.one ? 'Cara Memasukan Jadwal di Admin'
                              : this.state.two ? 'Cara Memasukan Materi di Guru'
                                : 'Cara Membuat Kelas'}</h3>
                          <div className="row m-b-100">

                            <div className="col-xl-12">
                              {this.state.one ?
                                // <Carousel
                                //   activeIndex={this.state.index}
                                //   onSelect={this.handleSelect.bind(this)}
                                //   style={{ border: '16px solid #e4e4e4', borderRadius: '10px' }}
                                // >
                                //   {gambar1.map((item, i) => {
                                //     return (
                                //       <Carousel.Item>
                                //         <img style={{ width: '100%' }} src={`images/${item.image1}`} />
                                //         <Carousel.Caption>
                                //           {i + 1}/15
                                //           </Carousel.Caption>
                                //       </Carousel.Item>
                                //     )
                                //   })}

                                // </Carousel>
                                <div style={{ border: '16px solid #e4e4e4', borderRadius: '10px', overflowX: 'auto', overflowY: 'scroll', height: '365px', }}>
                                  {this.state.fileData1.map((item, i) => {
                                    return (

                                      <img style={{ width: '100%', borderTop: '2px solid #9b9b9b' }} src={item.full_path_name} />

                                    )
                                  })}
                                </div>

                                : this.state.two ?
                                  <div style={{ border: '16px solid #e4e4e4', borderRadius: '10px', overflowX: 'auto', overflowY: 'scroll', height: '365px', }}>
                                  {this.state.fileData2.map((item, i) => {
                                    return (

                                      <img style={{ width: '100%', borderTop: '2px solid #9b9b9b' }} src={item.full_path_name} />

                                    )
                                  })}
                                </div>
                                  :
                                  <div style={{ border: '16px solid #e4e4e4', borderRadius: '10px', overflowX: 'auto', overflowY: 'scroll', height: '365px', }}>
                                    {this.state.fileData3.map((item, i) => {
                                      return (

                                        <img style={{ width: '100%', borderTop: '2px solid #9b9b9b' }} src={item.full_path_name} />

                                      )
                                    })}
                                  </div>
                              }




                            </div>
                          </div>
                        </div>
                      </div>
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

export default ClassBantuan;
