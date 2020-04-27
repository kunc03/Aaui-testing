import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Certificate extends Component {
  state = {
    type_activity: '1',
  };

  onClickLink = (e) => {
    this.setState({ type_activity: e.target.id });
  };

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
        return (
          <Link
            to={{
              pathname: '/certificate-create',
              params: {
                type_activity: this.state.type_activity,
                activity: 'kursus',
              },
            }}
          >
            kursus
          </Link>
        );

      case '2':
        return (
          <Link
            to={{
              pathname: '/certificate-create',
              params: {
                type_activity: this.state.type_activity,
                activity: 'forum',
              },
            }}
          >
            forum
          </Link>
        );

      case '3':
        return (
          <Link
            to={{
              pathname: '/certificate-create',
              params: {
                type_activity: this.state.type_activity,
                activity: 'grup',
              },
            }}
          >
            grup
          </Link>
        );

      default:
        return;
    }
  }
}
