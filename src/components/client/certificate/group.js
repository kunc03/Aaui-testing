import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class Course extends Component {
  state = {
    certificates: [],
  };

  componentDidMount() {
    const user_id = Storage.get('user').data.user_id;
    API.get(`${API_SERVER}v1/client-certificate/3/${user_id}`).then(
      async (res) => {
        if (res.status === 200) {
          let certificates = this.state.certificates;
          certificates = res.data.result;
          this.setState({ certificates: certificates });
        }
      }
    );
  }

  render() {
    return (
      <div className="row">
        {this.state.certificates.length === 0 ? (
          <div>Tidak ada sertifikat</div>
        ) : (
          this.state.certificates.map((elem, index) => {
            return (
              <div className="col-md-4 col-xl-4 mb-3" key={index}>
                <Link
                  className="card"
                  to={`/print-certificate${elem.template}/${elem.user_id}/${elem.certificate_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="responsive-image-content radius-top-l-r-5"
                    style={{
                      backgroundImage: `url(${elem.signature_1})`,
                    }}
                  ></div>
                  <div className="card-carousel ">
                    <div className="title-head f-w-900 f-16">{elem.title}</div>
                    <small className="mr-3">{elem.signature_name_1}</small>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    );
  }
}
