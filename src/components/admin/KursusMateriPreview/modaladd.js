import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

class ModalAdd extends Component {

  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);
    this.onClickSimpan = this.onClickSimpan.bind(this);

    this.state = {
      chapter_title: '',
      chapter_body: '',
      chapter_number: '',
      chapter_video: ''
    }
  }

  onClickSimpan = e => {
    e.preventDefault();
    const { triggerUpdate } = this.props;

    let data = {
      chapter_title: this.state.chapter_title,
      chapter_body: this.state.chapter_body,
      chapter_number: this.state.chapter_number,
      chapter_video: this.state.chapter_video
    }
    let datas = new FormData();
    datas.append('chapter_title', data.chapter_title);
    datas.append('chapter_body', data.chapter_body);
    datas.append('chapter_number', data.chapter_number);
    datas.append('chapter_video', data.chapter_video);
    datas.append('course_id', window.location.search.split('?')[1]);
    datas.append('company_id', Storage.get('user').data.user_id);
    datas.append('attachment_id', '1');

    let linkURL = `${API_SERVER}v1/chapter`;
    API.post(linkURL, datas).then(res => {
      console.log(res);
      let search = window.location.search.split('?')[1];
      window.location = '/kursus-materi-preview?' + search;
    }).catch((err) => {
      console.log(err);
    })
  }

  onChangeTitle = e => {
    this.setState({ chapter_title: e.target.value });
  }

  onChangeBody = e => {
    this.setState({ chapter_body: e.target.value });
  }

  onChangeNumber = e => {
    this.setState({ chapter_number: e.target.value });
  }

  onChangeLogo = e => {
    this.setState({ chapter_video: e.target.files[0] });
  }

  render() {
    const statusCompany = ['active', 'nonactive'];
    return (
      <div
        id="modalAdd"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="editModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div
            className="modal-content b-r-15"
            style={{ padding: "30px 50px" }}
          >
            <div
              className="modal-header p-b-0"
              style={{ borderBottom: "0 !important" }}
            >
              <h5
                className="modal-title p-t-0 f-21 f-w-bold text-c-black"
                id="exampleModalCenterTitle"
              >
                Add Course Material
              </h5>
            </div>
            <div className="modal-body">
              <Form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Chapter Title"
                    onChange={this.onChangeTitle}
                    value={this.state.chapter_title}
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Chapter Body
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Chapter Body"
                    onChange={this.onChangeBody}
                    value={this.state.chapter_body}
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Chapter Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Chapter Number"
                    onChange={this.onChangeNumber}
                    value={this.state.chapter_number}
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Logo Company
                  </label>
                  <input
                    type="file"
                    onChange={this.onChangeLogo}
                    className="form-control"
                    accept="image/*"
                  />
                </div>
              </Form>
            </div>
            <div
              className="modal-footer p-b-0"
              style={{ borderTop: "0 !important" }}
            >
              <button
                type="button"
                onClick={this.onClickSimpan}
                className="btn btn-primary btn-block f-18 f-w-bold openalertedit"
              >
                Save
              </button>

              <button
                type="button"
                className="btn btn-block bg-c-white text-c-grey3 f-18 f-w-bold"
                data-dismiss="modal"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalAdd;
