import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Table } from 'react-bootstrap';

export default class CertificateCreate extends Component {
  state = {
    id: '',
    title: '',
    template: '',
    type_activity: !this.props.location.params
      ? ''
      : this.props.location.params.type_activity,
    activity: !this.props.location.params
      ? ''
      : this.props.location.params.activity,
    sign1: '',
    sign2: '',
    listUser: [
      { id: 1, name: 'stefanus', email: 'adhie', value: false },
      { id: 2, name: 'adhie', email: 'stefanus', value: false },
      { id: 3, name: 'stefanus1', email: 'adhie1', value: false },
      { id: 4, name: 'adhie1', email: 'stefanus1', value: false },
    ],
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

  onSubmit = () => {
    let listUser = this.state.listUser
      .filter((elem) => elem.value)
      .map((obj) => obj.id);
    console.log(listUser);
  };

  render() {
    if (!this.props.location.params) {
      return <Redirect to="/certificate" />;
    } else {
      return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <h3 className="f-w-900 f-20">{this.state.activity}</h3>
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

                      {/* <Form.Group controlId="type_activity">
                        <Form.Label className="f-w-bold">
                          Select Type of Activity
                        </Form.Label>
                        <Form.Control
                          as="select"
                          onChange={this.onChangeForm}
                          value={this.state.type_activity}
                        >
                          <option value={''}>Select</option>
                          <option value={1}>Kursus</option>
                          <option value={2}>Forum</option>
                          <option value={3}>Group Meeting</option>
                        </Form.Control>
                      </Form.Group> */}

                      {/* <Form.Group
                        controlId="activity"
                        onChange={this.onChangeForm}
                      >
                        <Form.Label className="f-w-bold">
                          Select Activity
                        </Form.Label>
                        <Form.Control
                          as="select"
                          onChange={this.onChangeForm}
                          value={this.state.activity}
                        >
                          <option value={''}>Select</option>
                          <option value={1}>a</option>
                          <option value={2}>b</option>
                          <option value={3}>c</option>
                        </Form.Control>
                      </Form.Group> */}

                      <Form.Group controlId="sign1">
                        <Form.Label className="f-w-bold">
                          First Signature
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.sign1}
                          className="form-control"
                          placeholder="First Signature"
                          onChange={this.onChangeForm}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="sign2">
                        <Form.Label className="f-w-bold">
                          Second Signature
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.sign2}
                          className="form-control"
                          placeholder="Second Signature"
                          onChange={this.onChangeForm}
                          required
                        />
                      </Form.Group>

                      {this.table()}

                      <div>
                        <button
                          type="button"
                          onClick={this.onSubmit}
                          className="btn btn-primary f-w-bold"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  table() {
    if (this.state.activity !== '') {
      return (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              <th>email</th>
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
                        onChange={this.onChangeForm}
                      />
                    </Form.Group>
                  </td>
                  <td>{elem.name}</td>
                  <td>{elem.email}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
  }
}
