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
import Chapter from '../pelajaran/chapter';
import Kuis from '../pelajaran/kuis';
// import Tugas from '../pelajaran/tugas';
// import Ujian from '../pelajaran/ujian';

const KuisComponent = props => (<Kuis {...props} tipe="kuis" />);
const TugasComponent = props => (<Kuis {...props} tipe="tugas" />);
const UjianComponent = props => (<Kuis {...props} tipe="ujian" />);

const titleTabs = [
  {name: 'Overview', link: '/pelajaran', component: Overview},
  {name: 'Silabus', link: '/silabus', component: Silabus},
  {name: 'Sesi', link: '/chapter', component: Chapter},
  {name: 'Kuis', link: '/kuis', component: KuisComponent},
  {name: 'Tugas', link: '/tugas', component: TugasComponent},
  {name: 'Ujian', link: '/ujian', component: UjianComponent},
]

const switchTambahan = [
  {name: 'Personalia', link: '/personalia', component: GuruPersonalia},
  {name: 'Guru Kursus', link: '/kursus', component: GuruKurusus},
  {name: 'Ujian', link: '/ujian', component: GuruUjian},
  {name: 'Informasi Kelas', link: '/informasi-kelas', component: InformasiKelas},
  {name: 'Guru KPI', link: '/kpi', component: GuruKPI},
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
    let getPelajaranId = this.state.pelajaranId.split('/')[this.state.pelajaranId.split('/').length-1];
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${getPelajaranId}`).then(res => {

      if(res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ infoPelajaran: res.data.result })
    })
  }

	render() {
    let getPelajaranId = this.state.pelajaranId.split('/')[this.state.pelajaranId.split('/').length-1];

    return (
			<div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{padding: '40px 40px 0 40px'}}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="floating-back">
                    <Link to={`/kursus-new`}>
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                    ></img>
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">


                      <ul style={{paddingBottom: '0px'}} className="nav nav-pills">
                        <h3 className="mr-4">{this.state.infoPelajaran.nama_pelajaran}</h3>
                      {
                        titleTabs.map((item,i) => (
                          <li key={i} className={`nav-item`}>
                            <NavLink style={{borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}
                              activeClassName='active'
                              className={`nav-link`}
                              to={`/guru${item.link}/${getPelajaranId}`}>
                                <img src="/newasset/webinar.svg" className="mr-2"/>
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
