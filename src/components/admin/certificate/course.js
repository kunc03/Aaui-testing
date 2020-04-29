import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class Course extends Component {
  state = {
    kursusTerbaru: [],
    findCourseInput: '',
  };

  findCourse = (e) => {
    e.preventDefault();
    this.setState({ findCourseInput: e.target.value });
  };

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.fetchDataKursusTerbaru(res.data.result.company_id);

        // eslint-disable-next-line array-callback-return
        Object.keys(res.data.result).map((key, index) => {
          if (key === 'registered') {
            return (res.data.result[key] = res.data.result[key]
              .toString()
              .substring(0, 10));
          }
        });
        this.setState({ user: res.data.result });
      }
    });
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(
      `${API_SERVER}v1/course/company/${
        localStorage.getItem('companyID')
          ? localStorage.getItem('companyID')
          : companyId
      }`
    ).then((res) => {
      if (res.status === 200) {
        this.setState({
          kursusTerbaru: res.data.result
            .filter((item) => {
              return item.count_chapter > 0;
            })
            .slice(0, 3),
        });
      }
    });
  }

  componentDidMount() {
    this.fetchDataUser();
  }

  render() {
    let { kursusTerbaru, findCourseInput } = this.state;

    if (findCourseInput !== '') {
      [kursusTerbaru] = [kursusTerbaru].map((y) =>
        y.filter((x) =>
          JSON.stringify(Object.values(x))
            .replace(/[^\w ]/g, '')
            .match(new RegExp(findCourseInput, 'gmi'))
        )
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
                onChange={this.findCourse}
                placeholder="Kursus & Materi"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <InputGroup.Append style={{ cursor: 'pointer' }}>
                <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>

        {this.ListCourse(kursusTerbaru)}
      </div>
    );
  }

  ListCourse = (lists) => {
    if (lists.length !== 0) {
      return (
        <div className="row">
          {lists.map((item, i) => (
            <div className="col-sm-4" key={item.course_id}>
              <Link
                to={{
                  pathname: '/certificate-create',
                  params: {
                    type_activity: 1,
                    activity: item.course_id,
                    title: item.title,
                  },
                }}
              >
                {/* image resonsive content */}
                <div className="card">
                  <div
                    className="responsive-image-content radius-top-l-r-5"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  ></div>
                  <div className="card-carousel ">
                    <div className="title-head f-w-900 f-16">{item.title}</div>
                    <small className="mr-3">{item.count_chapter} Chapter</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    } else {
      return this.state.findCourseInput ? (
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">
                Tidak ditemukan &quot;{this.state.findCourseInput}&quot;
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
