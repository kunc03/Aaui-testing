import React, { Component } from "react";
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { Switch, Route } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';

import PtcClass from './ptc';
import PtcCreate from './create';
import PtcMasuk from './masuk';

const PtcComponent = props => (
  <PtcClass {...props} role={Storage.get('user').data.grup_name} />
)

const PtcMasukComponent = props => (
  <PtcMasuk {...props} role={Storage.get('user').data.grup_name} />
)

const switchPtc = [
  {name: 'PTC Create', link: '/create/:jenis', component: PtcCreate},
  {name: 'Rapat Create', link: '/create/:jenis', component: PtcCreate},
  {name: 'Edit Create', link: '/update/:jenis/:id', component: PtcCreate},
  {name: 'PTC Start', link: '/masuk/:jenis/:id', component: PtcMasukComponent},
];

class Ptc extends Component {

  render() {

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{padding: '40px 40px 0 40px'}}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                <ThemeProvider theme={lightTheme}>
                  <MeetingProvider>

                  <Switch>
                    <Route path="/ptc" exact component={PtcComponent} />
                    {
                      switchPtc.map(item => (
                        <Route key={item.link} path={`/ptc${item.link}`} component={item.component} />
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
      </div>
    );
  }
}

export default Ptc;
