import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment-timezone';
import BG from './images/BG.png';
import TTD from './images/TTD.png';
import TTD2 from './images/TTD2.png';
import Icademy from './images/Icademy.png';
import Star from './images/Star.png';
import Group1 from './images/Group1.png';
import API, { API_SERVER } from '../../../../repository/api';

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
    user_id: '',
  };

  printHandler() {
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
        this.setState({
          activity_id: res.data.result[0].activity_id,
          certificate_id: res.data.result[0].certificate_id,
          date: res.data.result[0].date,
          id: res.data.result[0].id,
          signature_1: res.data.result[0].signature_1,
          signature_2: res.data.result[0].signature_2,
          signature_name_1: res.data.result[0].signature_name_1,
          signature_name_2: res.data.result[0].signature_name_2,
          template: res.data.result[0].template,
          title: res.data.result[0].title,
          type_activity: res.data.result[0].type_activity,
          user_id: res.data.result[0].user_id,
        });
      }
      console.log(res);
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

                        <div style={Style.CERTIFICATEOFCOMPLET}>
                          {this.state.title}
                        </div>
                        <div style={Style.THISCERTIFICATEISPRO}>
                          THIS CERTIFICATE IS PROUDLY PRESENTED TO
                        </div>
                        <div style={Style.YoanitaRianti}>
                          {this.state.user_id}
                        </div>
                        <div style={Style.FORSUCCESSFULLYCOMPL}>
                          FOR SUCCESSFULLY COMPLETING
                        </div>
                        <div style={Style.ALLCONTENTSONONLINEC}>
                          ALL CONTENTS ON ONLINE COURSE
                        </div>
                        <div style={Style.KuasaiTOEFELPBTRaih6}>
                          Kuasai TOEFEL PBT, Raih 600+
                        </div>
                        <div style={Style.TANGGAL}>
                          {moment(this.state.date)
                            .tz('Asia/Jakarta')
                            .format('DD MMMM YYYY')}
                        </div>

                        <div style={Style.TTD}>
                          <img alt="" src={this.state.signature_1} />
                        </div>
                        <div style={Style.TandaTanganPenangung}>
                          {this.state.signature_name_1}
                        </div>
                        <div style={Style.TTD2}>
                          <img alt="" src={TTD2} />
                        </div>
                        <div style={Style.TandaTanganPenangung_0}>
                          {this.state.signature_name_2}
                        </div>

                        <div style={Style.Icademy}>
                          <img alt="" src={Icademy} />
                        </div>
                        <div style={Style.Star}>
                          <img alt="" src={Star} />
                        </div>
                        <div style={Style.Group1}>
                          <img alt="" src={Group1} />
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
    zIndex: '1',
  },

  TandaTanganPenangung: {
    left: '502px',
    top: '1087px',
    position: 'absolute',
    width: '100%',
    height: '29px',
    zIndex: '2',

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

  YoanitaRianti: {
    left: '837px',
    top: '452px',
    position: 'absolute',
    width: '100%',
    height: '39px',
    zIndex: '6',

    fontSize: '63px',
    color: '#674817',
    fontFamily: 'sans-serif',
    fontWeight: '600',
  },

  CERTIFICATEOFCOMPLET: {
    left: '650px',
    top: '330px',
    position: 'absolute',
    width: '1000px',
    height: '34px',
    zIndex: '7',

    fontFamily: 'sans-serif',
    fontSize: '38px',
    color: '#657373',
  },

  THISCERTIFICATEISPRO: {
    left: '701px',
    top: '403px',
    position: 'absolute',
    width: '100%',
    height: '21px',
    zIndex: '8',

    fontSize: 'xx-large',
    color: '#6f7975',
  },

  KuasaiTOEFELPBTRaih6: {
    left: '682px',
    top: '671px',
    position: 'absolute',
    width: '100%',
    height: '46px',
    zIndex: '9',

    fontSize: '51px',
    color: '#674817',
    fontFamily: 'sans-serif',
    fontWeight: '300',
  },

  FORSUCCESSFULLYCOMPL: {
    left: '786px',
    top: '560px',
    position: 'absolute',
    width: '100%',
    height: '21px',
    zIndex: '10',

    fontSize: 'xx-large',
    color: '#6f7975',
  },

  ALLCONTENTSONONLINEC: {
    left: '772px',
    top: '605px',
    position: 'absolute',
    width: '100%',
    height: '21px',
    zIndex: '11',

    fontSize: 'xx-large',
    color: '#6f7975',
  },

  TANGGAL: {
    left: '938px',
    top: '776px',
    position: 'absolute',
    width: '257px',
    height: '21px',
    zIndex: '12',

    fontSize: 'x-large',
    color: '#6f7975',
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
};
