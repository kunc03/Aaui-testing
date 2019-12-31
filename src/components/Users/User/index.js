import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class User extends Component {
  constructor(props) {
    super(props);

    this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("token"));
    let link = "https://8023.development.carsworld.co.id/v1/user";
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
        this.setState({ users: response.data.result });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  _deleteUser(idUser){
    
    let token = JSON.parse(localStorage.getItem("token"));
    let link = "https://8023.development.carsworld.co.id/v1/user" + idUser;

    var r = alert("Delete User ?");
    if (r === true) {
      axios.delete(link, {
        headers: {
          Authorization: token.data,
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        console.log(res)
        if(res.status === 200){
          window.location = '/users'
        }
        // this.props.history.push(`/news`);	
      }).catch(err => {
        console.log(err)
        //alert(err.response.data.msg)
      })
    }
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
          <Link to={`/user-update?${item.user_id}`} title="Edit">
            <img
              src="assets/images/component/Edit-1.png"
              className="img-icon-edit m-r-10"
              alt="Edit"
            />
          </Link>
          <a
            title="Delete"
            href=""
            onClick={this._deleteUser.bind(this,item.user_id)}
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
                                  to='/user-create'
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
