import React from 'react';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import { Editor } from '@tinymce/tinymce-react';

import SocketContext from '../../socket';

class Overview extends React.Component {

  state = {
    pelajaranId: this.props.match.params.id,

    overview: ''
  };

  handleEditorChange = e => {
    this.setState({ overview: e.target.getContent() })
  }

  simpanOverview = e => {
    e.preventDefault();

    if (this.state.overview) {
      // action simpan
      console.log('ada isinya')
      console.log(this.state.overview);

    } else {

    }
  }

  render() {
    // console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Overview</label>
                <Editor
                  apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                  initialValue={this.state.overview}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount"
                    ],
                    toolbar:
                      // eslint-disable-next-line no-multi-str
                      "undo redo | formatselect | bold italic backcolor | \
                     alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help"
                  }}
                  onChange={this.handleEditorChange}
                />
              </div>

              <div className="form-group">
                <button onClick={this.simpanOverview} type="button" className="btn btn-v2 btn-success">
                  <i className="fa fa-save"></i> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Overview;
