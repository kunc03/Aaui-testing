import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';


class EventNew extends Component {
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
          lists.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.course_id}>
              <Link to="">
                <div className={item.status ? 'border-blue-2 ' : 'box-disabled border-disabled'}>
                  <div className="box-event ">
                    <div className="title-head f-w-900 f-16 fc-skyblue">
                      {item.status ? item.title : ''} <small className="float-right">{item.status ? item.total : ''}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    );
  }
}

export default EventNew;
