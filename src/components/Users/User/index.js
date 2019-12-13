import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("user"));
    let link = "https://8023.development.carsworld.co.id/v1/user";
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
        this.setState({ users: response.data.result });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    let { users } = this.state;

    const Item = ({ item }) => (
      <tr>
        <td>{item.user_id}</td>
        <td>{item.name}</td>
        <td>{item.user_id}</td>
        <td>{item.branch_name}</td>
        <td>{item.grup_name}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>{item.validity}</td>
        <td class="text-center">
          <a href="edit-user-management.html" title="Edit">
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
        </td>
      </tr>
    );

    const Lists = ({ lists }) => (
      <tbody>
        {lists.map(list => (
          <Item key={list.user_id} item={list} />
        ))}
      </tbody>
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
                      <h3 className="f-24 f-w-800">User Management</h3>
                      <p>{this.state.list}</p>
                      <div style={{ overflowX: "auto" }}>
                        <table
                          className="table-curved"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th className="text-center">No.</th>
                              <th>Nama</th>
                              <th>Nomor Induk</th>
                              <th>Cabang</th>
                              <th>Group</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Validity</th>
                              <th className="text-center">
                                <Link
                                  to={"/user-create"}
                                  className="btn btn-ideku col-12 f-14"
                                  style={{ padding: "7px 8px !important" }}
                                >
                                  <img
                                    src="assets/images/component/person_add.png"
                                    className="button-img"
                                    alt=""
                                  />
                                  Add New
                                </Link>
                              </th>
                            </tr>
                          </thead>
                          <Lists lists={users} />
                        </table>
                      </div>
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
