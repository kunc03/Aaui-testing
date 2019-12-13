import React, { Component } from "react";
import { Link } from "react-router-dom";
import Modal from "./modal";

import axios from "axios";

class UserGroup extends Component {
  constructor(props) {
    super(props);

    this.onChangeBranch = this.onChangeBranch.bind(this);

    this.state = {
      branch: [],
      branchName: "",
      isOpen: false
    };
  }

  onChangeBranch = e => {
    this.setState({ branchName: e.target.value });
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  submitForm = e => {
    e.preventDefault();

    let link = "https://8023.development.carsworld.co.id/v1/auth";
    let data = { email: this.state.email, password: this.state.password };
    let header = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios
      .post(link, data, header)
      .then(function(response) {
        if (response.data.error) {
          this.setState({ email: e.target.value });
          this.setState({ password: e.target.value });
        } else {
          localStorage.setItem("user", JSON.stringify(response.data));
          window.location.href = window.location.origin;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("user"));
    let link = "https://8023.development.carsworld.co.id/v1/branch";
    let header = {
      headers: {
        Authorization: token.result.token,
        "Content-Type": "application/json"
      }
    };

    axios
      .get(link, header)
      .then(response => {
        console.log(response.data);
        this.setState({ branch: response.data.result });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    let { branch } = this.state;

    const Item = ({ item }) => (
      <li>
        <div className="card">
          <div
            className="card-block"
            style={{ padding: "25px 30px !important" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-6">
                <div className="row align-items-center justify-content-center">
                  <div className="col-auto f-21 f-w-bold text-c-black">1</div>
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Nama Cabang
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.branch_name}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-6 text-right">
                <p className="m-b-0">
                  <a
                    href="#"
                    title="Edit"
                    data-toggle="modal"
                    data-target="#modalEdit"
                  >
                    <img
                      src="assets/images/component/Edit-1.png"
                      className="img-icon-edit m-r-10"
                      alt="Edit"
                    />
                  </a>
                  <a
                    href="#"
                    title="Delete"
                    data-toggle="modal"
                    data-target="#modalDelete"
                  >
                    <img
                      src="assets/images/component/Delete-1.png"
                      className="img-icon-delete"
                      alt="Delete"
                    />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    );

    const Lists = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <Item key={list.branch_name} item={list} />
        ))}
      </ul>
    );
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        User Management (Cabang)
                      </h3>
                      <button
                        className="btn btn-ideku f-14 float-right mb-3"
                        style={{ padding: "7px 25px !important" }}
                        type="button"
                        data-toggle="modal"
                        data-target="#modalAdd"
                      >
                        <img
                          src="assets/images/component/person_add.png"
                          className="button-img"
                          alt=""
                        />
                        Add New
                      </button>
                    </div>
                    <div className="col-xl-12">
                      <Lists lists={branch} />
                    </div>
                    <Modal
                      show={this.state.isOpen}
                      onClose={this.toggleModal}
                    />
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

export default UserGroup;
