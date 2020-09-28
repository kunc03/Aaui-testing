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

    toDoList: this.props.lists,
    toDo: ''
  }

  handleToDoList = e => {
    if(e.key === 'Enter') {
      let push = {
        course_id: 1,
        type: "Personal",
        title: this.state.toDo,
        name: "ahmad",
        description: "Deskripsi"
      };
      let copy = [...this.state.toDoList];
      this.setState({ toDoList: copy });
    }
  }

  render() {
    console.log('STATE: ', this.state)
    const lists = this.state.toDoList;

    return (
      <div className="row">
        <div className="col-sm-12 mb-1">
          <input value={this.state.toDo} onKeyDown={this.handleToDoList} onChange={e => this.setState({ toDo: e.target.value })} type="text" className="form-control mb-3" placeholder="Tuliskan to do"/>
          <h3 className="f-w-900 f-18 fc-blue">List To Do</h3>
        </div>
        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              Tidak ada
            </div>
          :
          lists.map((item, i) => (
            <div className="col-sm-12 mb-1" key={item.course_id}>
                <div className="p-10" style={{borderBottom: '1px solid #E6E6E6'}}>
                  <div className="box-project">
                    <div className="box-badge-red">{item.type} </div>
                    <div className=" f-w-800 f-16 fc-black">
                      {item.title} <span className="f-w-600 f-12 fc-skyblue"> Diberikan kepada {item.name}</span>
                    </div>
                    <p className="text-muted">
                        {item.description}
                      </p>
                  </div>
                </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default ListToDoNew;
