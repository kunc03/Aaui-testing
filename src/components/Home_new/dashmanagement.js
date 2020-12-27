import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from "react-bootstrap";
import API, { USER_ME, API_SERVER } from "../../repository/api";
import Storage from "../../repository/storage";
import { toast } from "react-toastify";

import CalenderNew from "../kalender/kalender";
import EventNew from "./event";
import ListToDoNew from "./listToDo";
import ProjectNew from "./projek";

class DashGuru extends Component {
  state = {
    companyId: Storage.get("user").data.company_id,
    toDo: [],
    calendar: [],
    event: [],
    project: [],
    findCourseInput: "",
    kategoriKursus: [],
    kursusTerbaru: [],
    kursusDiikuti: [],
    recentDocs: []

  };

  openPengumuman = (e) => {
    e.preventDefault();
    this.setState({
      openPengumuman: true,
      pengumumanId: e.target.getAttribute("data-id"),
      pengumumanNama: e.target.getAttribute("data-title"),
      pengumumanIsi: e.target.getAttribute("data-isi"),
      pengumumanFile: e.target.getAttribute("data-file")
        ? e.target.getAttribute("data-file").split(",")
        : [],
    });
  };

  closePengumuman() {
    this.setState({
      openPengumuman: false,
      pengumumanId: "",
      pengumumanNama: "",
      pengumumanIsi: "",
      pengumumanFile: [],
    });
  }


  componentDidMount() {
    this.fetchPengumuman();
  }


  fetchPengumuman() {
    let url = null;
    if (this.state.level === "admin" || this.state.level === "superadmin") {
      url = `${API_SERVER}v1/pengumuman/company/${this.state.companyId}`;
    } else {
      url = `${API_SERVER}v1/pengumuman/role/${
        Storage.get("user").data.grup_id
      }`;
    }

    API.get(url)
      .then((response) => {
        this.setState({ pengumuman: response.data.result.reverse() });
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  render() {
    const EventDashboard = this.state.event;
    return (
      <div
        className="pcoded-main-container"
        style={{ backgroundColor: "#F6F6FD" }}
      >
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Event</h4>
                         <EventNew lists={EventDashboard} />
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                         <ProjectNew />
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">To Do List</h4>
                          <ListToDoNew lists={this.state.toDo} />
                        </Card.Body>
                      </Card>
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

export default DashGuru;
