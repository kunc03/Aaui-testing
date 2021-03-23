import React, { Component } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';

// ======= IMPORT COMPONENT GURU ======== //
import GuruPersonalia from '../guruPersonalia/index';
import GuruKurusus from '../guruKursus/index';
import GuruUjian from '../guruUjian/index';
import InformasiKelas from '../guruInformasiKelas/index';
import GuruKPI from '../guruKPI/index';

import Overview from '../pelajaran/overview';
import Silabus from '../pelajaran/silabus';
// import Chapter from '../pelajaran/chapter';
import Materi from '../pelajaran/materi';

import Kuis from '../pelajaran/kuis';
import KuisDetail from '../pelajaran/kuisdetail';
import Tugas from '../pelajaran/tugas';
import Murid from '../pelajaran/murid';
import Preview from '../pelajaran/preview';

const KuisComponent = props => (<Kuis {...props} tipe="kuis" />);
const UjianComponent = props => (<Kuis {...props} tipe="ujian" />);

const KuisDetailComponent = props => (<KuisDetail {...props} tipe="kuis" />);
const UjianDetailComponent = props => (<KuisDetail {...props} tipe="ujian" />);
const TugasDetailComponent = props => (<KuisDetail {...props} tipe="tugas" />);

const titleTabs = [
  { name: 'Overview', link: '/pelajaran', component: Overview },
  { name: 'Murid', link: '/murid', component: Murid },
  // { name: 'Silabus', link: '/silabus', component: Silabus },
  { name: 'Sesi', link: '/chapter', component: Materi },
  { name: 'Tugas', link: '/tugas', component: Tugas },
  { name: 'Kuis', link: '/kuis', component: KuisComponent },
  { name: 'Ujian', link: '/ujian', component: UjianComponent },
  { name: 'Preview', link: '/preview', component: Preview },
]

const switchTambahan = [
  { name: 'Detail Kuis', link: '/detail-kuis/:id/:examId', component: KuisDetailComponent },
  { name: 'Detail Ujian', link: '/detail-ujian/:id/:examId', component: UjianDetailComponent },
  { name: 'Detail Tugas', link: '/detail-tugas/:id/:examId', component: TugasDetailComponent },
  { name: 'Personalia', link: '/personalia', component: GuruPersonalia },
  { name: 'Guru Kursus', link: '/kursus', component: GuruKurusus },
  { name: 'Ujian', link: '/ujian', component: GuruUjian },
  { name: 'Informasi Kelas', link: '/informasi-kelas', component: InformasiKelas },
  { name: 'Guru KPI', link: '/kpi', component: GuruKPI },
];

export default class LearningGuru extends Component {

  state = {
    pelajaranId: this.props.location.pathname,
    infoPelajaran: {
      id: 0,
      nama: "Loading..."
    }
  }

  componentDidMount() {
    this.fetchPelajaran()
  }

  fetchPelajaran() {
    let pecah = this.state.pelajaranId.split('/');
    let getPelajaranId = pecah[3];
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${getPelajaranId}`).then(res => {

      if (res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ infoPelajaran: res.data.result })
    })
  }

  render() {
    let pecah = this.state.pelajaranId.split('/');
    let getPelajaranId = pecah[3];
    console.log('guru: ', this.state)
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="floating-back">
                    <Link to={`/jadwal-mengajar`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">


                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
                        <h3 className="mr-4">{this.state.infoPelajaran.nama_pelajaran}</h3>
                        {
                          titleTabs.map((item, i) => (
                            <li key={i} className={`nav-item`}>
                              <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                activeClassName='active'
                                className={`nav-link`}
                                to={`/guru${item.link}/${getPelajaranId}`}>
                                <img src="/newasset/webinar.svg" className="mr-2" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))
                        }
                      </ul>

                    </div>
                  </div>

                  <Switch>
                    {
                      titleTabs.map(item => (
                        <Route path={`/guru${item.link}/:id`} component={item.component} />
                      ))
                    }

                    {
                      switchTambahan.map(item => (
                        <Route path={`/guru${item.link}`} component={item.component} />
                      ))
                    }
                  </Switch>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
