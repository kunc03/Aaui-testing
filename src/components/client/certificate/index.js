import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Certificate1 from './Certificate 1';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

import ListCourse from './course';
import ListForum from './forum';
import ListGroup from './group';

export default class Certificate extends Component {
  state = {
    type_activity: '1',
  };

  onClickLink = (e) => {
    this.setState({ type_activity: e.target.id });
  };

  componentDidMount() {
    const user_id = Storage.get('user').data.user_id;
    API.get(`${API_SERVER}v1/client-certificate/1/${user_id}`).then(
      async (res) => {
        console.log(res);
      }
    );
  }

  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('l', 'px', [1755, 1240]);
      pdf.addImage(imgData, 'JPEG', 0, 0);

      // pdf.output('dataurlnewwindow');
      pdf.save('download.pdf');
    });

    // html2canvas(document.querySelector('#divToPrint')).then((canvas) => {
    //   document.body.appendChild(canvas); // if you want see your screenshot in body.
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgData, 'PNG', 0, 0);
    //   pdf.save('download.pdf');
    // });
  }

  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link onClick={this.onClickLink}>
                        <div
                          id="1"
                          className={
                            this.state.type_activity === '1'
                              ? 'kategori-aktif'
                              : 'kategori title-disabled'
                          }
                        >
                          <img
                            alt="Kursus & Materi"
                            src={
                              this.state.type_activity === '1'
                                ? '/assets/images/component/kursuson.png'
                                : '/assets/images/component/kursusoff.png'
                            }
                            className="img-fluid"
                          />
                          &nbsp; Kursus & Materi
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link onClick={this.onClickLink}>
                        <div
                          id="2"
                          className={
                            this.state.type_activity === '2'
                              ? 'kategori-aktif'
                              : 'kategori title-disabled'
                          }
                        >
                          <img
                            alt="Forum"
                            src={
                              this.state.type_activity === '2'
                                ? '/assets/images/component/forumon.png'
                                : '/assets/images/component/forumoff.png'
                            }
                            className="img-fluid"
                          />
                          &nbsp; Forum
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link onClick={this.onClickLink}>
                        <div
                          id="3"
                          className={
                            this.state.type_activity === '3'
                              ? 'kategori-aktif'
                              : 'kategori title-disabled'
                          }
                        >
                          <img
                            alt="Group Meeting"
                            src={
                              this.state.type_activity === '3'
                                ? '/assets/images/component/liveon.png'
                                : '/assets/images/component/liveoff.png'
                            }
                            className="img-fluid"
                          />
                          &nbsp; Group Meeting
                        </div>
                      </Link>
                    </div>
                  </div>

                  {this.listActivity()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  listActivity() {
    switch (this.state.type_activity) {
      case '1':
        return <ListCourse />;

      case '2':
        return <ListForum />;

      case '3':
        return <ListGroup />;

      default:
        return;
    }
  }
}
