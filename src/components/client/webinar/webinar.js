import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Lists from './lists';

export default class Webinar extends Component {

  state = {
    // webinar: this.props.match.param.webinar,
    project: "Sales Projek",
    projects: ["Bisnis Projek", "Marketing Projek", "Sales Projek"],
    webinars: [
      { name: "Why Choose America", pembicara: "John Kennedy", status: "Belum Selesai", waktu: "08:00", tanggal: "20 Sep 2020", peserta: 67, lampiran: [] },
      { name: "Trik Jitu Marketing", pembicara: "Koh Yong", status: "Selesai", waktu: "09:00", tanggal: "11 Sep 2020", peserta: 70, lampiran: [] },
    ]
  }

  changeSelectProject = (e) => {
    e.preventDefault();
    if (e.target.value == "Bisnis Projek") {
      this.setState({
        project: e.target.value,
        webinars: [
          { name: "Why Choose America", pembicara: "John Kennedy", status: "Belum Selesai", waktu: "08:00", tanggal: "20 Sep 2020", peserta: 67, lampiran: [] },
          { name: "ReactJS for Project", pembicara: "Alvin Kamal", status: "Selesai", waktu: "10:00", tanggal: "15 Sep 2020", peserta: 7, lampiran: [] },
          { name: "Trik Jitu Marketing", pembicara: "Koh Yong", status: "Selesai", waktu: "09:00", tanggal: "11 Sep 2020", peserta: 70, lampiran: [] },
        ]
      });
    } else if (e.target.value == "Sales Projek") {
      this.setState({
        project: e.target.value,
        webinars: [
          { name: "Why Choose America", pembicara: "John Kennedy", status: "Belum Selesai", waktu: "08:00", tanggal: "20 Sep 2020", peserta: 67, lampiran: [] },
          { name: "Trik Jitu Marketing", pembicara: "Koh Yong", status: "Selesai", waktu: "09:00", tanggal: "11 Sep 2020", peserta: 70, lampiran: [] },
        ]
      });
    } else if (e.target.value == "Marketing Projek") {
      this.setState({
        project: e.target.value,
        webinars: [
          { name: "ReactJS for Project", pembicara: "Alvin Kamal", status: "Selesai", waktu: "10:00", tanggal: "15 Sep 2020", peserta: 7, lampiran: [] },
        ]
      });
    } else {
      this.setState({
        project: "", webinars: []
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('STATEPREV: ', prevState)
    // this.props.changeLevel("Sekretaris");
  }

  render() {
    console.log('STATE: ', this.state);
    console.log('STATEP:', this.props.match.params.webinar)
    let { projects, webinars, project } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    <Link to="" className="btn btn-sm mr-4" style={{
                      border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                    }}>
                      <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                    </Link>
                    Webinar
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    <Link to="/webinar/add" className="btn btn-sm btn-primary btn-v2">
                      <i className="fa fa-plus"></i> Add Webinar
                    </Link>
                  </p>
                </div>
                <div className="col-sm-12">
                  <select onChange={this.changeSelectProject} className="form-control" value={project}>
                    <option value="">Silahkan Pilih Projek Terlebih Dahulu</option>
                    {
                      projects.map(item => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Lists items={webinars} />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}