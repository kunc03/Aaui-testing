import React, { Component } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';

import Overview from '../pelajaran/overview';
import Chapter from '../pelajaran/chapter';
import Kuis from '../pelajaran/kuis';
// import Tugas from '../pelajaran/tugas';
// import Ujian from '../pelajaran/ujian';

const KuisComponent = props => (<Kuis {...props} tipe="kuis" />);
const TugasComponent = props => (<Kuis {...props} tipe="tugas" />);
const UjianComponent = props => (<Kuis {...props} tipe="ujian" />);

const titleTabs = [
  { name: 'Overview', link: '/pelajaran', component: Overview },
  { name: 'Chapter', link: '/chapter', component: Chapter },
  { name: 'Kuis', link: '/kuis', component: Kuis },
  { name: 'Task', link: '/tugas', component: Tugas },
  { name: 'Exam', link: '/ujian', component: Ujian },
]

const switchTambahan = [
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
    let getPelajaranId = this.state.pelajaranId.split('/')[this.state.pelajaranId.split('/').length - 1];

    API.get(`${API_SERVER}v2/pelajaran/one/${getPelajaranId}`).then(res => {

      console.log('STATE: ', res.data.result);

      if (res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ infoPelajaran: res.data.result })
    })
  }

  render() {
    let getPelajaranId = this.state.pelajaranId.split('/')[this.state.pelajaranId.split('/').length - 1];

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
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
