import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class Group extends Component {
  state = {
    classRooms: [],
    filterMeeting: '',
  };

  filterMeeting = (e) => {
    e.preventDefault();
    this.setState({ filterMeeting: e.target.value });
  };

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID')
            ? localStorage.getItem('companyID')
            : res.data.result.company_id,
        });
        API.get(
          `${API_SERVER}v1/liveclass/company/${
            localStorage.getItem('companyID')
              ? localStorage.getItem('companyID')
              : res.data.result.company_id
          }`
        ).then((res) => {
          if (res.status === 200) {
            this.setState({ classRooms: res.data.result.reverse() });
          }
        });
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    let { classRooms, filterMeeting } = this.state;

    if (filterMeeting !== '') {
      classRooms = classRooms.filter((x) =>
        JSON.stringify(Object.values(x)).match(new RegExp(filterMeeting, 'gmi'))
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12 col-xl-12" style={{ marginBottom: '10px' }}>
            <InputGroup className="mb-3" style={{ background: '#FFF' }}>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa fa-search"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ background: '#FFF' }}
                onChange={this.filterMeeting}
                placeholder="Group Meeting"
                aria-describedby="basic-addon1"
              />
              <InputGroup.Append style={{ cursor: 'pointer' }}>
                <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
        {this.ClassRooms(classRooms)}
      </div>
    );
  }

  ClassRooms = (lists) => {
    if (lists.length !== 0) {
      return (
        <div className="row">
          {lists.map((item) => (
            <div className="col-sm-4" key={item.class_id}>
              <Link
                to={{
                  pathname: '/certificate-create',
                  params: {
                    type_activity: 3,
                    activity: item.class_id,
                    title: item.room_name,
                  },
                }}
              >
                <div className="card">
                  <div
                    className="responsive-image-content radius-top-l-r-5"
                    style={{
                      backgroundImage: `url(${
                        item.cover
                          ? item.cover
                          : '/assets/images/component/meeting-default.jpg'
                      })`,
                    }}
                  ></div>
                  <div className="card-carousel ">
                    <div className="title-head f-w-900 f-16">
                      {item.room_name}
                    </div>
                    <h3 className="f-14">{item.name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    } else {
      return this.state.filterMeeting ? (
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">
                Tidak ditemukan &quot;{this.state.filterMeeting}&quot;
              </h3>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">Memuat halaman...</h3>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };
}
