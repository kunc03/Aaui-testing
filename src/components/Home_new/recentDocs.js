import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';


class ListToDoNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
  }


  render() {
  //  console.log(this.props, 'props evenntttt')
    const lists = this.props.lists;
    return (
      <div className="row">
        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              Tidak ada
            </div>
          :
          <table>
            <tr>
                <th>nama</th>
                <th>folder</th>
                <th>link</th>
                <th>tanggal</th>
            </tr>
            {lists.map((item, i) => (
                <tr>
                    <td>{item.filename}</td>
                    <td>{item.name}</td>
                    <td>{item.url}</td>
                    <td>{item.date}</td>
                </tr>
            ))}
          </table>
        }
      </div>
    );
  }
}

export default ListToDoNew;
