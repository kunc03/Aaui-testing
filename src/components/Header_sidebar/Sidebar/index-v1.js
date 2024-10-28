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
          {/* <small class="sub-logo-text">Online Learning Platform</small> */}
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
                  <span className="pcoded-mtext f-16 f-w-bold">
                    Kursus &amp; Materi
                  </span>
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
                  <span className="pcoded-mtext f-16 f-w-bold">
                    Forum diskusi
                  </span>
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
                  <span className="pcoded-mtext f-16 f-w-bold">Kelas</span>
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
                  <span className="pcoded-mtext f-16 f-w-bold">Aktivitas</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="#" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/files-off.png.png"
                      alt=""
                      style={{
                        paddingLeft: "3px"
                      }}
                    ></img>
                  </span>
                  <span className="pcoded-mtext f-16 f-w-bold">Files</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="/Pengaturan" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Pengaturan.png"
                      alt=""
                      style={{
                        paddingLeft: "3px"
                      }}
                    ></img>
                  </span>
                  <span className="pcoded-mtext f-16 f-w-bold">Pengaturan</span>
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
                  <span className="pcoded-mtext f-16 f-w-bold">Users</span>
                </Link>
              </li>
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link to="/company" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Forum.png"
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext f-16 f-w-bold">Company</span>
                </Link>
              </li>
              <li
                data-username="Sample Page"
                className="nav-item mt-4  bg-c-purple-dark"
              >
                <Link to="/logout" className="nav-link">
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Logout.png"
                      style={{
                        paddingLeft: "3px"
                      }}
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext f-16 f-w-bold">Logout</span>
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
