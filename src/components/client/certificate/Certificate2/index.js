import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment-timezone';
import BG from './images/BG.png';
import Icademy from './images/Icademy.png';
import Icon from './images/Icon.png';
import API, { API_SERVER } from '../../../../repository/api';
import Storage from '../../../../repository/storage';

export default class Component1 extends Component {
  state = {
    activity_id: '',
    certificate_id: '',
    date: '',
    id: '',
    signature_1: '',
    signature_2: '',
    signature_name_1: '',
    signature_name_2: '',
    template: '',
    title: '',
    type_activity: '',
    name: '',
    title_certificate: '',
  };

  printHandler() {
    // eslint-disable-next-line no-unused-vars
    let originalContents, popupWin, printContents;
    return (
      (printContents = document.getElementById('print').innerHTML),
      (originalContents = document.body.innerHTML),
      (popupWin = window.open()),
      popupWin.document.open(),
      popupWin.document.write(
        '<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' +
          printContents +
          '</html>'
      ),
      popupWin.document.close()
    );
  }

  componentWillMount() {
    const user_id = this.props.location.pathname.split('/')[2];
    const certificate_id = this.props.location.pathname.split('/')[3];

    API.get(
      `${API_SERVER}v1/detail-certificate/${user_id}/${certificate_id}`
    ).then(async (res) => {
      if (res.status === 200) {
        this.setState(res.data.result[0]);
      }
    });
  }

  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <Button onClick={this.printHandler.bind(this)}>Print</Button>

                  <div>
                    <div id="print">
                      <div style={Style.background}>
                        <div style={Style.BG}>
                          <img alt="" src={BG} />
                        </div>

                        <div style={{ position: 'relative', left: '-25vh' }}>
                          <div style={Style.CERTIFICATEOFCOMPLET}>
                            {this.state.title}
                          </div>
                          <div style={Style.THISCERTIFICATEISPRO}>
                            THIS CERTIFICATE IS PROUDLY PRESENTED TO
                          </div>
                          <div style={Style.YoanitaRianti}>
                            {this.state.name}
                          </div>
                          <div style={Style.FORSUCCESSFULLYCOMPL}>
                            FOR SUCCESSFULLY COMPLETING
                          </div>
                          <div style={Style.ALLCONTENTSONONLINEC}>
                            ALL CONTENTS ON ONLINE COURSE
                          </div>
                          <div style={Style.KuasaiTOEFELPBTRaih6}>
                            {this.state.title_certificate}
                          </div>
                          <div style={Style.TANGGAL}>
                            {moment(this.state.date)
                              .tz(moment.tz.guess(true))
                              .format('DD MMMM YYYY')}
                          </div>

                          <div style={Style.TTD}>
                            {this.state.signature_1 == null ? null : (
                              <img
                                alt=""
                                src={this.state.signature_1}
                                style={Style.imgttd}
                              />
                            )}
                          </div>
                          <div style={Style.TandaTanganPenangung_0}>
                            {this.state.signature_name_1}
                          </div>
                          <div style={Style.TTD2}>
                            {this.state.signature_2 == null ? null : (
                              <img
                                alt=""
                                src={this.state.signature_2}
                                style={Style.imgttd}
                              />
                            )}
                          </div>
                          <div style={Style.TandaTanganPenangung}>
                            {this.state.signature_name_2}
                          </div>
                        </div>

                        <div style={Style.Icademy}>
                          <img alt="" src={Icademy} />
                        </div>
                        <div style={Style.Logo}>
                          <img alt="" src={Storage.get('user').data.logo} />
                        </div>
                        <div style={Style.Icon}>
                          <img alt="" src={Icon} />
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

const Style = {
  body: {
    margin: '0',
    padding: '0',
  },

  background: {
    left: '0px',
    top: '0px',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '1755px',
    height: '1240px',
    overflow: 'hidden',
    zIndex: '0',
  },

  BG: {
    left: '0px',
    top: '0px',
    position: 'absolute',
    width: '1755px',
    height: '1240px',
    zIndex: 1,
  },

  TandaTanganPenangung: {
    left: '502px',
    top: '1087px',
    position: 'absolute',
    width: '100%',
    height: '29px',
    zIndex: 2,

    fontSize: 'xx-large',
    color: '#6f7975',
  },

  TTD2: {
    left: '516px',
    top: '859px',
    position: 'absolute',
    width: '396px',
    height: '192px',
    zIndex: '3',
  },

  TandaTanganPenangung_0: {
    left: '1154px',
    top: '1087px',
    position: 'absolute',
    width: '428px',
    height: '29px',
    zIndex: '4',

    fontSize: 'xx-large',
    color: '#6f7975',
  },

  TTD: {
    left: '1168px',
    top: '859px',
    position: 'absolute',
    width: '396px',
    height: '192px',
    zIndex: '5',
  },

  imgttd: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  YoanitaRianti: {
    left: '650px',
    top: '452px',
    position: 'absolute',
    width: '800px',
    height: '39px',
    zIndex: '6',

    fontSize: '63px',
    color: '#674817',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    textAlign: 'center',
  },

  CERTIFICATEOFCOMPLET: {
    left: '650px',
    top: '330px',
    position: 'absolute',
    width: '800px',
    height: '34px',
    zIndex: '7',

    fontFamily: 'sans-serif',
    fontSize: '38px',
    color: '#657373',
    textAlign: 'center',
    letterSpacing: '5px',
  },

  THISCERTIFICATEISPRO: {
    left: '650px',
    top: '403px',
    position: 'absolute',
    width: '800px',
    height: '21px',
    zIndex: '8',

    fontSize: 'xx-large',
    color: '#6f7975',
    textAlign: 'center',
  },

  KuasaiTOEFELPBTRaih6: {
    left: '650px',
    top: '671px',
    position: 'absolute',
    width: '800px',
    height: '46px',
    zIndex: '9',

    fontSize: '51px',
    color: '#674817',
    fontFamily: 'sans-serif',
    fontWeight: '300',
    textAlign: 'center',
  },

  FORSUCCESSFULLYCOMPL: {
    left: '650px',
    top: '560px',
    position: 'absolute',
    width: '800px',
    height: '21px',
    zIndex: '10',

    fontSize: 'xx-large',
    color: '#6f7975',
    textAlign: 'center',
  },

  ALLCONTENTSONONLINEC: {
    left: '650px',
    top: '605px',
    position: 'absolute',
    width: '800px',
    height: '21px',
    zIndex: '11',

    fontSize: 'xx-large',
    color: '#6f7975',
    textAlign: 'center',
  },

  TANGGAL: {
    left: '650px',
    top: '776px',
    position: 'absolute',
    width: '800px',
    height: '21px',
    zIndex: '12',

    fontSize: 'x-large',
    color: '#6f7975',
    textAlign: 'center',
  },

  Icademy: {
    left: '1520px',
    top: '1137px',
    position: 'absolute',
    width: '166px',
    height: '35px',
    zIndex: '13',
  },

  Star: {
    left: '193px',
    top: '317px',
    position: 'absolute',
    width: '187px',
    height: '178px',
    zIndex: '14',
  },

  Group1: {
    left: '908px',
    top: '79px',
    position: 'absolute',
    width: '251px',
    height: '201px',
    zIndex: '15',
  },
  Logo: {
    left: '752px',
    top: '79px',
    position: 'absolute',
    width: '250px',
    height: '201px',
    zIndex: '14',
  },

  Icon: {
    left: '189px',
    top: '173px',
    position: 'absolute',
    width: '139px',
    height: '155px',
    zIndex: '15',
  },
};
