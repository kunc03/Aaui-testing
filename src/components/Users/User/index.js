import React, { Component } from "react";

class User extends Component {
  render() {
    return (
      <div>
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <h3 className="f-24 f-w-800">User Management</h3>
                        <div style={{ overflowX: "auto" }}>
                          <table
                            className="table-curved"
                            style={{ width: "100%" }}
                          >
                            <tbody>
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
                                  <a
                                    href="add-user-management.html"
                                    className="btn btn-ideku col-12 f-14"
                                    style={{ padding: "7px 8px !important" }}
                                  >
                                    <img
                                      src="assets/images/component/person_add.png"
                                      className="button-img"
                                      alt=""
                                    />
                                    Add New
                                  </a>
                                </th>
                              </tr>
                              <tr>
                                <td className="text-center">1</td>
                                <td>Rajaka Kauthar Allam</td>
                                <td>3299384810289909</td>
                                <td>Bangbayang</td>
                                <td>Limit Space</td>
                                <td>rakaal@gmail.com</td>
                                <td>081247949214</td>
                                <td>2019/02/10</td>
                                <td className="text-center">
                                  <a
                                    href="edit-user-management.html"
                                    title="Edit"
                                  >
                                    <img
                                      src="assets/images/component/Edit-1.png"
                                      className="img-icon-edit m-r-10"
                                      alt="Edit"
                                    />
                                  </a>
                                  <a
                                    href
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
                              <tr>
                                <td className="text-center">1</td>
                                <td>Rajaka Kauthar Allam</td>
                                <td>3299384810289909</td>
                                <td>Bangbayang</td>
                                <td>Limit Space</td>
                                <td>rakaal@gmail.com</td>
                                <td>081247949214</td>
                                <td>2019/02/10</td>
                                <td className="text-center">
                                  <a
                                    href="edit-user-management.html"
                                    title="Edit"
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
                                </td>
                              </tr>
                            </tbody>
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
      </div>
    );
  }
}

export default User;
