import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class RiwayatKursus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'AKTIVITAS',
        registered: '2019-12-09',
        companyId: '',
      },
      kategoriKursus: [],
      kursusTerbaru: [],
      kursusDiikuti: this.props.recent,
      today : '',
      tabIndex : 1
    }
    console.log("RECENTTSSS STATES",this.props.recent)
  }

  componentDidMount() {
    this.fetchDataUser();
    //this.fetchDataKursusDiikuti();
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

  fetchDataKursusDiikuti() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then(res => {
      if(res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse().slice(0,6) })
      }
    })
  }

  render() {
    const { kursusDiikuti } = this.state;
    
    console.log('state',this.state);

    return (
        <div className="col-sm-12">
            <div className="row">
            <div className="col-md-12 col-xl-12 mb-3">
                <div className="row d-flex align-items-center">
                <div className="col-6">
                    <h3 className="f-w-900 f-20">Riwayat Kursus</h3>
                </div>
                <div className="col-6 text-right">
                    <p className="m-b-0">
                    <span className="f-w-600 f-16">Lihat Semua</span>
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* <ListKursusDiikuti lists={kursusDiikuti} /> */}

            {kursusDiikuti.length === 0 ? 
                <Card>
                    <Card.Body>
                        <h3 className="f-w-900 f-20">Anda tidak mengikuti kursus apapun.</h3>
                    </Card.Body>
                </Card>
                :
                <div className="row">
                {
                kursusDiikuti.map((item, i) => (
                <div className="col-sm-4" key={item.id_user_activity}>
                        <Link to='/aktivitas'>
                        <div className="card">
                            <div className="box-image">
                            <img
                                className="img-kursus-diikuti"
                                src="assets/images/component/Pattern Geometric-01.png"
                                alt="dashboard-user"
                            />
                            <div className="card-text-title">{item.activity_title}</div>
                            </div>
                            <div className="card-carousel">
                            <div className="title-head f-16">
                                {item.activity_title}
                            </div>
                            <div className="row m-t-50">
                                <div className="col-6">
                                <small className="f-w-600 m-b-10">
                                    Tipe
                                </small>
                                <h6>
                                    <small className="f-w-600">
                                    {item.description}
                                    </small>
                                </h6>
                                </div>
                                {/* <div className="col-6">
                                <div className="progress m-b-10">
                                    <div
                                    className="progress-bar progress-c-yellow"
                                    role="progressbar"
                                    style={{ width: "40%", height: 6 }}
                                    aria-valuenow={60}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    />
                                </div>
                                <small className="f-w-600">
                                    Proses (20%)
                                </small>
                                </div> */}
                            </div>
                            </div>
                        </div>
                        </Link>
                    </div>
                    ))
                }
                </div>
            }

        </div>
                  
    );
  }
}

export default RiwayatKursus;
