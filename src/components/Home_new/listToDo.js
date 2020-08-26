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
        <div className="col-sm-12 mb-1">
          <input type="text" className="form-control mb-3" placeholder="Tuliskan to do"/>
          <h3 className="f-w-900 f-18 fc-blue">List To Do</h3>
        </div>
        {
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
