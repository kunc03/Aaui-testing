import React from 'react';

import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { Link } from 'react-router-dom';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Overview extends React.Component {

  state = {
    jadwalId: this.props.match.params.id,

    overview: 'Loading...'
  };

  handleEditorChange = e => {
    this.setState({ overview: e.target.getContent() })
  }

  simpanOverview = e => {
    e.preventDefault();

    if (this.state.overview) {
      // action simpan
      API.put(`${API_SERVER}v2/pelajaran/overview/${this.state.jadwalId}`, { overview: this.state.overview }).then(res => {
        if (res.data.error) console.log(`Error: update overview`)

        this.fetchOverview()
        toast.success(`Overview updated`)
      })

    } else {

    }
  }

  componentDidMount() {
    this.fetchOverview();
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/${this.state.jadwalId}`).then(res => {
      if (res.data.error) console.log(`Error: fetch overview`)

      this.setState({ overview: res.data.result.deskripsi });
    })
  }

  render() {
    // //console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Overview</label>
                <input id="my-file" type="file" name="my-file" style={{ display: "none" }} onChange="" />
                {
                  this.state.overview !== 'Loading...' ?
                    <Editor
                      apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                      initialValue={this.state.overview}
                      value={this.state.overview}
                      init={{
                        height: 460,
                        menubar: false,
                        convert_urls: false,
                        image_class_list: [
                          { title: 'None', value: '' },
                          { title: 'Responsive', value: 'img-responsive' },
                          { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                        ],
                        file_browser_callback_types: 'image',
                        file_picker_callback: function (callback, value, meta) {
                          if (meta.filetype == 'image') {
                            var input = document.getElementById('my-file');
                            input.click();
                            input.onchange = function () {

                              var dataForm = new FormData();
                              dataForm.append('file', this.files[0]);

                              window.$.ajax({
                                url: `${API_SERVER}v2/media/upload`,
                                type: 'POST',
                                data: dataForm,
                                processData: false,
                                contentType: false,
                                success: (data) => {
                                  callback(data.result.url);
                                  this.value = '';
                                }
                              })

                            };
                          }
                        },
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount"
                        ],
                        toolbar:
                          // eslint-disable-next-line no-multi-str
                          "undo redo | insertfile formatselect | bold italic backcolor | \
                       alignleft aligncenter alignright alignjustify | image | \
                        bullist numlist outdent indent | removeformat | help"
                      }}
                      onEditorChange={e => this.setState({ overview: e })}
                    />
                    :
                    null
                }
              </div>

              { /** window.tinyMCE.activeEditor && this.props.showImageUpload &&
              <div className="attachments-button" onClick={window.tinyMCE.activeEditor.buttons.image.onclick}>
              <span id="attachment-label">{this.props.showLabel ? 'Upload an image' : ''}</span>
              </div> */}

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
