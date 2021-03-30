import React from 'react'
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';

import { ThemeProvider } from 'styled-components';
import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';

import Mengajar from '../ruangan_mengajar/mengajar'
import Kelas from '../ruangan_mengajar/kelas'

const MengajarComponent = props => <Mengajar {...props} role={Storage.get('user').data.grup_name} />;
const KelasComponent = props => <Kelas {...props} role={Storage.get('user').data.grup_name} />;

const titleTabs = [
  { name: 'Ruangan Mengajar', link: '/mengajar/:jadwalId/:jenis/:sesiId', component: MengajarComponent},
  { name: 'Ruangan Kelas', link: '/kelas/:kelasId', component: KelasComponent},
]

class LearningRuangan extends React.Component {

  render() {
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">
              <div className="main-body">

                <ThemeProvider theme={lightTheme}>
                  <MeetingProvider>

                    <Switch>
                      {
                        titleTabs.map(item => (
                          <Route path={`/ruangan${item.link}`} component={item.component} />
                        ))
                      }
                    </Switch>

                  </MeetingProvider>
                </ThemeProvider>


              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default LearningRuangan;
