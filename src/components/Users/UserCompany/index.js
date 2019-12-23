import React, { Component } from "react";
import ModalAdd from "./modaladd";
import axios from "axios";

class UserCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isOpen: false
    };
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("token"));
    let link = "https://8023.development.carsworld.co.id/v1/company";
    let header = {
      headers: {
        Authorization: token.data,
        "Content-Type": "application/json"
      }
    };

    axios
      .get(link, header)
      .then(response => {
        console.log(response.data);
        this.setState({ grup: response.data.result });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    let { grup } = this.state;

    const Item = ({ item }) => (
      <li>
        <div className="card">
          <div
            className="card-block"
            style={{ padding: "25px 30px !important" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-xl-4 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Company
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.company_name}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Logo
                    </small>
                    <img
                      src={item.logo}
                      className="img-icon-delete"
                      alt="Logo"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Validity
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.validity.toString().substring(0, 10)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Status
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.status}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12 text-right">
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
          <Item key={list.company_id} item={list} />
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
                  {/* [ Main Content ] start */}
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        User Management (Company)
                      </h3>
                      <a
                        href="#"
                        className="btn btn-ideku f-14 float-right mb-3"
                        style={{ padding: "7px 25px !important" }}
                        data-toggle="modal"
                        data-target="#modalAdd"
                      >
                        <img
                          src="assets/images/component/person_add.png"
                          className="button-img"
                          alt=""
                        />
                        Add New
                      </a>
                    </div>
                    <div className="col-xl-12">
                      <div style={{ overflowX: "auto" }}>
                        <Lists lists={grup} />
                      </div>
                    </div>
                    <ModalAdd
                      show={this.state.isOpen}
                      onClose={this.toggleModal}
                    >
                      `Here's some content for the modal`
                    </ModalAdd>
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

export default UserCompany;
