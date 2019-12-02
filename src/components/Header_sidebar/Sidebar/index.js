import React, { Component } from "react";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <nav className="pcoded-navbar">
        <div className="navbar-wrapper">
          <div className="navbar-brand header-logo">
            <Link to="/" className="b-brand">
              <div className="b-bg">
                <span className="pcoded-micon">
                  <img
                    src="assets/images/component/Logo Ideku.png"
                    className="logo-sidebar"
                    alt=""
                  />
                </span>
              </div>
              <span className="b-title">IDEKU</span>
            </Link>
            <a href="javascript:" className="mobile-menu" id="mobile-collapse">
              <span />
            </a>
          </div>
          <div className="navbar-content scroll-div">
            <ul className="nav pcoded-inner-navbar">
              <li className="nav-item pcoded-menu-caption">
                <label />
              </li>
              <li data-username="Sample Page" className="nav-item active mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Kursus.png"
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Kursus &amp; Materi</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Forum.png"
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Forum diskusi</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Kelas.png"
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Kelas</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Aktivitas.png"
                      alt=""
                      style={{
                        paddingLeft: "3px"
                      }}
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Aktivitas</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Pengaturan.png"
                      alt=""
                      style={{
                        paddingLeft: "3px"
                      }}
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Pengaturan</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="/user" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Forum.png"
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Users</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Logout.png"
                      style={{
                        paddingLeft: "3px"
                      }}
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Sidebar;
