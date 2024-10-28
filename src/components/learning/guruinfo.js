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

    API.get(`${API_SERVER}v2/pelajaran/one/${getPelajaranId}`).then(res => {

      console.log('STATE: ', res.data.result);

      if(res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ infoPelajaran: res.data.result })
    })
  }

	render() {
    let getPelajaranId = this.state.pelajaranId.split('/')[this.state.pelajaranId.split('/').length-1];

    return (

      <Switch>
        {
          switchTambahan.map(item => (
            <Route path={`/guru-info${item.link}`} component={item.component} />
          ))
        }
      </Switch>
		);
	}

}
