import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Table, Modal } from 'react-bootstrap';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class CertificateCreate extends Component {
  state = {
    id: '',
    title: '',
    template: '',
    type_activity: !this.props.location.params
      ? ''
      : this.props.location.params.type_activity,
    activity_id: !this.props.location.params
      ? ''
      : this.props.location.params.activity,
    signature_1: '',
    signature_1_img: '',
    signature_name_1: '',
    signature_2: '',
    signature_2_img: '',
    signature_name_2: '',
    listUser: [],
    quiz: 0,
    ujian: 0,

    isNotifikasi: false,
    isiNotifikasi: '',
  };

  onChangeForm = (e) => {
    if (e.target.id === 'listUser') {
      let listUser = this.state.listUser;
      let indexUser = listUser.findIndex(
        (elem) => elem.id === Number(e.target.value)
      );
      listUser[indexUser]['value'] = !listUser[indexUser].value;
      this.setState({ listUser: listUser });
    } else {
      this.setState({ [e.target.id]: e.target.value }, () => {
        let a = this.state;
        this.setState(a);
      });
    }
  };

  handleChange = (e) => {
    if (e.target.files[0].size <= 500000) {
      this.setState({
        [e.target.id]: e.target.files[0],
        [`${e.target.id}_img`]: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      e.target.value = null;
      this.setState({
        isNotifikasi: true,
        isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.',
      });
    }
  };

  closeNotifikasi = (e) => {
    this.setState({ isNotifikasi: false, isiNotifikasi: '' });
  };

  onSubmit = () => {
    let listUser = this.state.listUser
      .filter((elem) => elem.value)
      .map((obj) => obj.id);

    let formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('template', this.state.template);
    formData.append('type_activity', this.state.type_activity);
    formData.append('activity_id', this.state.activity_id);
    formData.append('signature_1', this.state.signature_1);
    formData.append('signature_name_1', this.state.signature_name_1);
    formData.append('signature_2', this.state.signature_2);
    formData.append('signature_name_2', this.state.signature_name_2);
    formData.append('listUser', JSON.stringify(listUser));
    if (this.state.id === '') {
      /**
       * create
       */
      API.post(`${API_SERVER}v1/certificate`, formData).then(async (res) => {
        l
        alert('success simpan');
      });
    } else {
      /**
       * update
       */
      API.put(`${API_SERVER}v1/certificate/${this.state.id}`, formData).then(
        async (res) => {
          alert('success update');
        }
      );
    }
  };

  onDelete = () => {
    API.delete(`${API_SERVER}v1/certificate/${this.state.id}`).then(
      async (res) => {
        alert('success hapus');
      }
    );
  };

  fetchUserCourse() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID')
            ? localStorage.getItem('companyID')
            : res.data.result.company_id,
        });
        API.get(
          `${API_SERVER}v1/hasilkursus/${res.data.result.user_id}/${this.state.activity_id}`
        ).then((res) => {
          if (res.status === 200) {
            this.setState({
              kursus: res.data.result.users,
              detail: res.data.result,
            });
          }
        });
      }
    });
  }

  getListUser() {
    switch (this.state.type_activity) {
      case 1:
        API.get(
          `${API_SERVER}v1/hasilkursus/${Storage.get('user').data.user_id}/${
            this.state.activity_id
          }`
        ).then(async (res) => {
          let listUser = res.data.result.users;

          // eslint-disable-next-line array-callback-return
          listUser.map((elem) => {
            elem['id'] = elem.user_id;
            elem['value'] = false;
          });

          this.setState({
            listUser: listUser,
            quiz: res.data.result.quiz,
            ujian: res.data.result.ujian,
          });

          this.getCertificate();
        });
        break;

      default:
        break;
    }
  }

  getCertificate() {
    API.get(
      `${API_SERVER}v1/certificate/${this.state.type_activity}/${this.state.activity_id}`
    ).then(async (res) => {
      if (res.data.result[1].length !== 0 && res.data.result[2].length !== 0) {
        let a = res.data.result[1][0];
        let b = res.data.result[2];
        let listUser = this.state.listUser;

        // eslint-disable-next-line array-callback-return
        b.map((elem) => {
          let id = listUser.find((val) => {
            return val.id === elem.user_id;
          });
          id['value'] = !id.value;
        });

        this.setState({
          id: a.id,
          title: a.title,
          template: a.template,
          signature_1: a.signature_1,
          signature_1_img: a.signature_1,
          signature_name_1: a.signature_name_1,
          signature_2: a.signature_2,
          signature_2_img: a.signature_2,
          signature_name_2: a.signature_name_2,
        });
        this.setState(listUser);
      }
    });
  }

  componentDidMount() {
    this.getListUser();
  }

  render() {
    if (!this.props.location.params) {
      return <Redirect to="/certificate-admin" />;
    } else {
      return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <h3 className="f-w-900 f-20">
                      {this.props.location.params.title}
                    </h3>
                    <Form>
                      <Form.Group controlId="title">
                        <Form.Label className="f-w-bold">Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.title}
                          className="form-control"
                          placeholder="Title"
                          onChange={this.onChangeForm}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="template">
                        <Form.Label className="f-w-bold">Template</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={this.onChangeForm}
                          value={this.state.template}
                        >
                          <option value={''}>Select</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                        </Form.Control>
                      </Form.Group>

                      {this.state.template !== '' ? (
                        <img
                          alt="media"
                          src={'/assets/images/component/placeholder-image.png'}
                          className="img-fluid"
                          style={{ width: '200px', height: '160px' }}
                        />
                      ) : null}
                      <br></br>

                      <input
                        id="signature_1"
                        accept="image/*"
                        className="btn-default"
                        name="signature_1"
                        type="file"
                        onChange={this.handleChange}
                      />
                      <br></br>

                      <img
                        alt="media"
                        src={
                          this.state.signature_1_img === null ||
                          this.state.signature_1_img === ''
                            ? '/assets/images/component/placeholder-image.png'
                            : this.state.signature_1_img
                        }
                        className="img-fluid"
                        style={{ width: '200px', height: '160px' }}
                      />

                      <Form.Group controlId="signature_name_1">
                        <Form.Label className="f-w-bold">
                          First Signature
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.signature_name_1}
                          className="form-control"
                          placeholder="First Signature"
                          onChange={this.onChangeForm}
                          required
                        />
                      </Form.Group>

                      <input
                        id="signature_2"
                        accept="image/*"
                        className="btn-default"
                        name="signature_2"
                        type="file"
                        onChange={this.handleChange}
                      />
                      <br></br>

                      <img
                        alt="media"
                        src={
                          this.state.signature_2_img === null ||
                          this.state.signature_2_img === ''
                            ? '/assets/images/component/placeholder-image.png'
                            : this.state.signature_2_img
                        }
                        className="img-fluid"
                        style={{ width: '200px', height: '160px' }}
                      />

                      <Form.Group controlId="signature_name_2">
                        <Form.Label className="f-w-bold">
                          Second Signature
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.signature_name_2}
                          className="form-control"
                          placeholder="Second Signature"
                          onChange={this.onChangeForm}
                          required
                        />
                      </Form.Group>

                      {this.table()}

                      <div className="row">
                        <div>
                          <button
                            type="button"
                            onClick={this.onSubmit}
                            className="btn btn-primary f-w-bold"
                          >
                            {this.state.id ? 'Update' : 'Submit'}
                          </button>
                        </div>
                        &nbsp;
                        {this.state.id ? (
                          <div>
                            <button
                              type="button"
                              onClick={this.onDelete}
                              className="btn btn-danger f-w-bold"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </Form>

                    <Modal
                      show={this.state.isNotifikasi}
                      onHide={this.closeNotifikasi}
                    >
                      <Modal.Body>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Notifikasi
                        </Modal.Title>

                        <p style={{ color: 'black', margin: '20px 0px' }}>
                          {this.state.isiNotifikasi}
                        </p>

                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.closeNotifikasi}
                        >
                          Mengerti
                        </button>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  createHeader() {
    let header = [];

    for (let i = 0; i < this.state.quiz; i++) {
      header.push(<th>quiz {i + 1}</th>);
    }

    for (let i = 0; i < this.state.ujian; i++) {
      header.push(<th>ujian {i + 1}</th>);
    }

    return header;
  }

  table() {
    if (this.state.activity_id !== '') {
      return (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              {this.createHeader()}
            </tr>
          </thead>

          <tbody>
            {this.state.listUser.map((elem, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Form.Group controlId="listUser">
                      <Form.Check
                        type="checkbox"
                        value={elem.id}
                        checked={elem.value}
                        onChange={this.onChangeForm}
                      />
                    </Form.Group>
                  </td>
                  <td>{elem.name}</td>
                  {elem.quiz.map((value, id) => {
                    return <td key={id}>{value[0] ? value[0].score : null}</td>;
                  })}
                  {elem.ujian.map((value, id) => {
                    return <td key={id}>{value[0] ? value[0].score : null}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
  }
}
