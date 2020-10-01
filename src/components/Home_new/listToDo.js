import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import API, {API_SERVER, USER_ME} from '../../repository/api';
import { toast } from "react-toastify";

class ListToDoNew extends Component {
  state = {
    userId: Storage.get('user').data.user_id,
    toDoList: this.props.lists,
    toDo: ''
  }

  handleToDoList = e => {
    if(e.key === 'Enter') {
      let form = {
        type: "Personal",
        title: this.state.toDo,
        userId: this.state.userId,
        authorId: this.state.userId,
        description: ""
      };
      API.post(`${API_SERVER}v2/todo/create`, form).then(res => {
        if(res.data.error) toast.warning("Gagal create todo");
        this.fetchData();
      });
    }
  }

  doneToDo = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.put(`${API_SERVER}v2/todo/done/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal update data");
      this.fetchData();
    })
  }

  deleteToDo = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/todo/delete/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal hapus data");
      this.fetchData();
    })
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/todo/get/${this.state.userId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      this.setState({ toDoList: res.data.result, toDo: "" });
    });
  }

  render() {
    const lists = this.state.toDoList;

    return (
      <div className="row">
        <div className="col-sm-12 mb-1">
          <input value={this.state.toDo} onKeyDown={this.handleToDoList} onChange={e => this.setState({ toDo: e.target.value })} type="text" className="form-control mb-3" placeholder="Tuliskan to do"/>
          
        </div>
        <table className="table">
          <tbody>
          {
            lists.length == 0 ?
              <div className="col-sm-12 mb-1">
                Tidak ada
              </div>
            :
            lists.map((item, i) => (
              <tr key={item.id}>
                <td className="text-center">
                  <input checked={item.status == 2 ? true : false} onClick={this.doneToDo} data-id={item.id} style={{ cursor: 'pointer'}} type="checkbox" />
                </td>
                <td style={item.status == 2 ? {textDecoration: 'line-through'} : {}}>{item.title}</td>
                <td className="text-center"><i onClick={this.deleteToDo} data-id={item.id} style={{ cursor: 'pointer'}} className="fa fa-trash"></i></td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListToDoNew;
