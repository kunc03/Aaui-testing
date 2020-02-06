import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, {USER_ME} from '../../../repository/api';
import Storage from '../../../repository/storage';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: 'Anonymous',
      level: 'member'
    }
  }

  componentDidMount() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200){
        this.setState({ user: res.data.result.name, level: res.data.result.level });
      }
    })
  }

  render() {
    const { user, level } = this.state;
    return (
      <header className="navbar pcoded-header navbar-expand-lg navbar-light">
        <div className="m-header">
          <a className="mobile-menu" id="mobile-collapse1" href="javascript:">
            <span />
          </a>
          <a href="index.html" className="b-brand">
            <div className="b-bg">
              <img
                src="assets/images/component/Logo Ideku.png"
                className="logo-sidebar"
                alt=""
              />
            </div>
            <span className="b-title">IDEKU</span>
          </a>
        </div>
        <a className="mobile-menu" id="mobile-header" href="javascript:">
          <i className="feather icon-more-horizontal" />
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <Link to="/Profile">
                <div className="media">
                  <img
                    alt=""
                    className="img-radius"
                    style={{ width: 40, height: 40 }}
                    src="assets/images/user/avatar-1.jpg"
                  />
                  <div className="media-body mt-1 ml-1">
                    <h6 className="chat-header f-w-900">
                      {user}
                      <small className="d-block  mt-2 text-c-grey">{level}</small>
                    </h6>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li>
              <div className="dropdown">
                <a className href="javascript:" data-toggle="dropdown">
                  <i className="icon feather icon-bell f-20 text-c-grey" />
                  <i
                    className="fa fa-circle text-warning notif"
                    style={{ fontSize: 11 }}
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-right notification">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">Notifications</h6>
                    <div className="float-right">
                      <a href="javascript:" className="m-r-10">
                        mark as read
                      </a>
                      <a href="javascript:">clear all</a>
                    </div>
                  </div>
                  <ul className="noti-body">
                    <li className="n-title">
                      <p className="m-b-0">NEW</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-1.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>John Doe</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>New ticket Added</p>
                        </div>
                      </div>
                    </li>
                    <li className="n-title">
                      <p className="m-b-0">EARLIER</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-2.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Joseph William</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>Prchace New Theme and make payment</p>
                        </div>
                      </div>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-3.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Sara Soudein</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>currently login</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="noti-footer">
                    <a href="javascript:">show all</a>
                  </div>
                </div>
              </div>
            </li>
            
          </ul>
        </div>
      </header>
    );
  }
}

export default Header;
