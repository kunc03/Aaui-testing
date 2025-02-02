import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import KelasKu from '../detail_kelas/kelasku';
import MataPelajaran from '../daftar_pelajaran/mapel';
import Timeline from '../daftar_pelajaran/timeline';
import Progress from '../daftar_pelajaran/progress';
import Tugas from '../tugas/index';
import Latihan from '../tugas/latihan';
import Detail from '../tugas/detail';
import DetailMapel from '../tugas/mapel';
import KerjakanLagi from '../tugas/kerjakanlagi';

const KuisComponent = props => <Latihan {...props} tipe="kuis" />;
const UjianComponent = props => <Latihan {...props} tipe="ujian" />;

const KuisDetail = props => <Detail {...props} role={'murid'} tipe="kuis" />;
const UjianDetail = props => <Detail {...props} role={'murid'} tipe="ujian" />;

const titleTabs = [
  {name: 'Kelas', link: '/kelas', component: KelasKu},
  {name: 'Progress', link: '/timeline', component: Progress},
  {name: 'Schedule', link: '/mata-pelajaran', component: MataPelajaran},
  {name: 'Task', link: '/tugas', component: Tugas},
  {name: 'Quiz', link: '/kuis', component: KuisComponent},
  {name: 'Exam', link: '/ujian', component: UjianComponent},
]

const switchTambahan = [
  {name: 'Detail', link: '/detail-kuis/:examId', component: KuisDetail},
  {name: 'Detail', link: '/detail-ujian/:examId', component: UjianDetail},
  {name: 'Detail', link: '/detail-mapel/:jadwalId', component: DetailMapel},
  {name: 'Detail', link: '/kerjakan-lagi/:examId', component: KerjakanLagi},
];

export default class LearningMurid extends Component {

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
    }
  }

  goBack(){
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                      onClick={this.goBack.bind(this)}
                    ></img>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">

                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
                        {
                          titleTabs.map((item, i) => (
                            <li key={i} className={`nav-item`}>
                              <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                activeClassName='active'
                                className={`nav-link`}
                                to={`/murid${item.link}`}>
                                <img src="/newasset/webinar.svg" className="mr-2" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))
                        }
                      </ul>

                    </div>
                  </div>

                  <div className="row mt-3">
                  <Switch>
                    <Route path="/murid" exact component={MataPelajaran} />
                    {
                      titleTabs.map(item => (
                        <Route path={`/murid${item.link}`} component={item.component} />
                      ))
                    }

                    {
                      switchTambahan.map(item => (
                        <Route path={`/murid${item.link}`} component={item.component} />
                      ))
                    }
                  </Switch>
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
