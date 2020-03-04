import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card,  Row, Col, } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class RiwayatLiveClass extends Component {
  state = {
    user: {
      name: 'AKTIVITAS',
      registered: '2019-12-09',
      companyId: '',
    },
    kategoriKursus: [],
    kursusTerbaru: [],
    historyForum: [],
    today : '',
    tabIndex : 1
  }

  componentDidMount() {
    this.fetchDataUser();
    this.fetchDatahistoryForum();
    let date = new Date();
   // console.log(String(date));
    this.setState({today:String(date)})
  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.fetchDataKategoriKursus(res.data.result.company_id);
        this.fetchDataKursusTerbaru(res.data.result.company_id);
        
        Object.keys(res.data.result).map((key, index) => {
          if(key === 'registered') {
            return res.data.result[key] = res.data.result[key].toString().substring(0,10);
          }
        });
        this.setState({ user: res.data.result});
      }
    })
  }

  fetchDataKategoriKursus(companyId) {
    API.get(`${API_SERVER}v1/category/company/${companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kategoriKursus: res.data.result.filter(item => { return item.count_course > 0 }) })
      }
    })
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kursusTerbaru: res.data.result.filter(item => { return item.count_chapter > 0 }).slice(0,3) })
      }
    }) 
  }

  fetchDatahistoryForum() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then(res => {
      if(res.status === 200) {
        this.setState({ historyForum: res.data.result.reverse().slice(0,6) })
      }
    })
  }

  render() {
    const { historyForum } = this.state;

    return (
        <div className="col-sm-12">
            <div className="row">
            <div className="col-md-12 col-xl-12 mb-3">
                <div className="row d-flex align-items-center">
                    <div className="col-6">
                        <h3 className="f-w-900 f-20">Riwayat Live Class</h3>
                    </div>
                </div>
            </div>
            </div>

            {historyForum.length === 0 ? 
                <Card>
                    <Card.Body>
                        <h3 className="f-w-900 f-20">Anda tidak mengikuti kursus apapun.</h3>
                    </Card.Body>
                </Card>
                :
                <div className="card">
                    <div className="col-sm-12">
                    {historyForum.map((item, i) => (
                            <div className="komentar-item p-15" style={{marginBottom: '15px', borderBottom: "#dedede solid 1px"}}>
                                    <h3 className="f-18 f-w-bold f-w-800">
                                        Anda Sedang Mengikuti LIVE CLASS ({item.course.category_name})
                                        <span className="f-12" style={{float: 'right', fontWeight: 'normal'}}>12/12/2020 03:00 PM</span>
                                    </h3>
                                    <p><a href="/aktivitas"> Lanjut ikuti </a></p>
                            </div>
                        ))
                    }
                    </div>
                </div>
            }

        </div>
                  
    );
  }
}

export default RiwayatLiveClass;
