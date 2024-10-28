import React, { Component } from "react";
import { Link } from "react-router-dom";


class EventNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
  }


  render() {
    const lists = this.props.lists;

    return (
      <div className="row">
        {
          lists.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.course_id}>
              <Link to={item.to}>
                <div className={item.status ? 'border-blue-2 ' : 'border-disabled'}>
                  <div className="box-event ">
                    <div className="title-head f-w-900 f-16 fc-skyblue">
                      {item.title} <small className="float-right">{item.total}</small>
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
