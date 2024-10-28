import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

const CheckMedia = ({ media }) => {
  if (media) {
    let ekSplit = media.split(".");
    let ektension = ekSplit[ekSplit.length - 1];
    if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
      return (
        <div>
          <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${media})`}}></div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url('https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640')`}}></div>
        </div>
      );
    }
  }
  return null;
};

export default class KategoriKursus extends Component {

	state = {
		categoryId: this.props.match.params.category_id,
		categoryName: '',
		companyId: '',

		kursus: []
	}

	fetchDataKursus() {
		this.fetchDataKategori(this.state.categoryId);
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

				API.get(`${API_SERVER}v1/course/category/${this.state.categoryId}/${this.state.companyId}`).then(res => {
          console.log('res:', res.data.result)
					if(res.status === 200) {
						this.setState({ kursus: res.data.result });
					}
				})
			}
		})
	}

	fetchDataKategori(catId) {
		API.get(`${API_SERVER}v1/category/${catId}`).then(res => {
			if(res.status === 200) {
				this.setState({ categoryName: res.data.result.category_name })
			}
		})
	}

	componentDidMount() {
		this.fetchDataKursus()
	}

	render() {
		const { kursus, categoryName } = this.state;

		const ListKursusBaru = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div className="row">
            {
              lists.map((item, i) => (
                <div className="col-sm-4">
                  <Link to={`/detail-kursus/${item.course_id}`}>
                    <div className="card">
                      <CheckMedia media={item.thumbnail ? item.thumbnail : item.image} />
                      <div className="card-carousel ">
                        <div className="title-head f-w-900 f-16">
                          {item.title}
                        </div>
                        <small className="mr-3">{item.count_chapter} Chapter</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
        );
      } else {
        return (
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <h3 className="f-w-900 f-24">Memuat halaman...</h3>
              </Card.Body>
            </Card>
          </div>
        );
      }
    };

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        {categoryName}
                      </h3>
                    </div>
                  </div>

                  <ListKursusBaru lists={kursus} />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
		);
	}

}