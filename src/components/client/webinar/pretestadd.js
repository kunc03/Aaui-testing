import React, { Component, Fragment } from 'react';
import API, { API_SERVER } from '../../../repository/api';
import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

const Msg = ({ msg, closeToast, toastProps }) => (
  <div>
    <Fragment>Question <div dangerouslySetInnerHTML={{ __html: msg }}></div> The answer to that question has not been set.</Fragment>
  </div>
)

export default class WebinarPretestAdd extends Component {

  state = {
    waktu: 0,
    update: false,
    webinarId: this.props.webinarId ? this.props.webinarId : '',
    pertanyaan: [
      // {
      //   tanya: 'Bagaimana pendapat Anda tentang pembicara ?',
      //   a: 'Sangat Baik',
      //   b: 'Cukup Baik',
      //   c: 'Baik',
      //   d: 'Tidak Baik',
      //   e: 'Sangat Tidak Baik'
      // },
    ],

    formFile: null,
    loading: false,
  }

  onClickTambahPertanyaan = () => {
    let baruPertanyaan = {
      tanya: '',
      a: '',
      b: '',
      c: '',
      d: '',
      e: ''
    };
    this.setState({
      pertanyaan: [...this.state.pertanyaan, baruPertanyaan]
    })
  }

  handleJawaban = (e, i) => {
    const { value } = e.target;
    let newObj = [...this.state.pertanyaan];

    newObj[i]['jawab'] = value;
    this.setState({ pertanyaan: newObj });
  }
  handleDynamicInput = (e, i) => {
    let newObj = [...this.state.pertanyaan];
    if (e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[i][name] = value;
      this.setState({ pertanyaan: newObj });
    } else {
      newObj[i].tanya = e;
      this.setState({ pertanyaan: newObj });
    }
    // const { value, name } = e.target;
    // let newObj = [...this.state.pertanyaan];

    // newObj[i][name] = value;
    // this.setState({ pertanyaan: newObj });
  }

  onClickHapusPertanyaan = (e) => {
    let dataIndex = e.target.getAttribute('data-id');
    let dataID = e.target.getAttribute('data-index');
    API.delete(`${API_SERVER}v2/webinar-test/pertanyaan/${dataIndex}`).then(res => {
      if (res.data.error) toast.warning("Delete failed");

      toast.success("Pre-test question deleted")
      let kurangi = this.state.pertanyaan.filter((item, i) => i !== parseInt(dataID));
      this.setState({
        pertanyaan: kurangi
      })
    })
  }

  saveKuesioner() {
    if (this.state.waktu === 0){
      toast.warning('You have to fill working duration');
    }
    else{
      let form = {
        id: this.state.webinarId,
        webinar_test: this.state.pertanyaan,
        jenis: 0,
        waktu: this.state.waktu
      };
  
      if (form.webinar_test.filter(item => !item.jawab).length > 0) {
        toast.warning(<Msg msg={form.webinar_test.filter(item => !item.jawab)[0].tanya} />)
      }
      else {
        API.post(`${API_SERVER}v2/webinar-test`, form).then(res => {
          if (res.status === 200) {
            if (res.data.error) {
              toast.error('Error post data')
            } else {
              toast.success(`Saved`)
              this.props.closeModal()
            }
          }
        })
      }
    }
  }

  updateKuesioner() {
    if (this.state.waktu === 0){
      toast.warning('You have to fill working duration');
    }
    else{
      let form = {
        id: this.state.webinarId,
        webinar_test: this.state.pertanyaan,
        jenis: 0,
        waktu: this.state.waktu
      };
  
      if (form.webinar_test.filter(item => !item.jawab).length > 0) {
        toast.warning(<Msg msg={form.webinar_test.filter(item => !item.jawab)[0].tanya} />)
      }
      else {
        API.put(`${API_SERVER}v2/webinar-test`, form).then(res => {
          if (res.status === 200) {
            if (res.data.error) {
              toast.error('Error post data')
            } else {
              toast.success(`Saved`)
              this.props.closeModal()
            }
          }
        })
      }
    }
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar-test/${this.state.webinarId}/0`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ pertanyaan: res.data.result, waktu: res.data.waktu })
          if (this.state.pertanyaan.length <= 0) {
            this.setState({ update: false })
          }
          else {
            this.setState({ update: true })
          }
        }
      }
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  submitImport = e => {
    e.preventDefault();
    this.setState({ loading: true });
    let form = new FormData();
    form.append('webinarId', this.state.webinarId);
    form.append('jenis', 0);
    form.append('excel', this.state.formFile);

    API.post(`${API_SERVER}v2/webinar-test/import`, form).then(res => {
      if (res.data.error) toast.warning("Error import data");

      toast.success("Success import pre test")
      this.setState({ loading: false })
      this.fetchData();
    })
  }

  render() {

    //console.log('state: ', this.state);

    // const DaftarPertanyaan = ({items}) => (
    //   <div>
    //     {
    //       items.map((item,i) => (
    //         <div className="form-group">
    //           <label>Pertanyaan {i+1}</label>
    //           <span className="float-right">
    //             <i data-index={i} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
    //           </span>
    //           <textarea onChange={e => this.handleDynamicInput(e, i)} name="tanya" className="form-control" rows="3" value={item.tanya} />

    //           <div className="jawaban mt-3 ml-4">
    //             <label>Tambahkan Jawaban</label>
    //             <tr>
    //               <td>
    //                 A
    //               </td>
    //               <td>
    //                 <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.a} className="form-control" style={{width: '460px'}} />
    //               </td>
    //             </tr>
    //             <tr>
    //               <td>
    //                 B
    //               </td>
    //               <td>
    //                 <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{width: '460px'}} />
    //               </td>
    //             </tr>
    //             <tr>
    //               <td>
    //                 C
    //               </td>
    //               <td>
    //                 <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{width: '460px'}} />
    //               </td>
    //             </tr>
    //             <tr>
    //               <td>
    //                 D
    //               </td>
    //               <td>
    //                 <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="d" value={item.d} className="form-control" style={{width: '460px'}} />
    //               </td>
    //             </tr>
    //             <tr>
    //               <td>
    //                 E
    //               </td>
    //               <td>
    //                 <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="e" value={item.e} className="form-control" style={{width: '460px'}} />
    //               </td>
    //             </tr>
    //           </div>
    //         </div>
    //       ))
    //     }
    //   </div>
    // );

    return (
      <div className="row">
        <div className="col-sm-12">
          <div style={{ marginTop: '10px' }}>
            <form onSubmit={this.submitImport} role="form" className="form-vertical">
              <div className="form-group row">
                <div className="col-sm-3">
                  <label>Template Excel</label>
                  <a href={`${API_SERVER}attachment/template-test.xlsx`} target="_blank" className="btn btn-primary">Download</a>
                </div>
                <div className="col-sm-6">
                  <label>Import Excel</label>
                  <input required onChange={e => this.setState({ formFile: e.target.files[0] })} className="form-control" type="file" />
                </div>
                <div className="col-sm-3">
                  <button style={{ marginTop: '22px' }} className="btn btn-primary" type="submit">
                    <i className="fa fa-save"></i> {this.state.loading ? "Sedang proses..." : "Save"}
                  </button>
                </div>
              </div>
            </form>

            <div className="row mt-4">
              <div className="col-sm-12">
                <div className="form-group">
                  <label className="bold"> Working Duration (Minutes)</label>
                  <input type="number" className="form-control" name="waktu" onChange={e => this.setState({ waktu: e.target.value })} value={this.state.waktu} />
                </div>

                {
                  this.state.pertanyaan.map((item, i) => (
                    <div className="form-group">
                      <label>Question {i + 1}</label>
                      <span className="float-right">
                        <i data-index={i} data-id={item.id} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{ cursor: 'pointer' }}></i>
                      </span>
                      <input id={`myFile${i}`} type="file" name={`myFile${i}`} style={{ display: "none" }} onChange="" />
                      <Editor
                        apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                        initialValue={item.tanya}
                        value={item.tanya}
                        init={{
                          height: 200,
                          menubar: false,
                          convert_urls: false,
                          image_class_list: [
                            { title: 'None', value: '' },
                            { title: 'Responsive', value: 'img-responsive' },
                            { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                          ],
                          file_browser_callback_types: 'image media',
                          file_picker_callback: function (callback, value, meta) {
                            if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                              var input = document.getElementById(`myFile${i}`);
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
                            "undo redo | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | image media | \
                            bullist numlist outdent indent | removeformat | help"
                        }}
                        onEditorChange={e => this.handleDynamicInput(e, i)}
                      />

                      <div className="jawaban mt-3 ml-4">
                        <label>Add Pre Test Answers</label>
                        <tr>
                          <td>
                            <input name={i} checked={item.jawab === 'a' ? true : false} type="radio" value="a" onChange={e => this.handleJawaban(e, i)} /> A
                              </td>
                          <td>
                            <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="a" value={item.a} className="form-control" style={{ width: '460px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input name={i} checked={item.jawab === 'b' ? true : false} type="radio" value="b" onChange={e => this.handleJawaban(e, i)} /> B
                              </td>
                          <td>
                            <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{ width: '460px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input name={i} checked={item.jawab === 'c' ? true : false} type="radio" value="c" onChange={e => this.handleJawaban(e, i)} /> C
                              </td>
                          <td>
                            <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{ width: '460px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input name={i} checked={item.jawab === 'd' ? true : false} type="radio" value="d" onChange={e => this.handleJawaban(e, i)} /> D
                              </td>
                          <td>
                            <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="d" value={item.d} className="form-control" style={{ width: '460px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input name={i} checked={item.jawab === 'e' ? true : false} type="radio" value="e" onChange={e => this.handleJawaban(e, i)} /> E
                              </td>
                          <td>
                            <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="e" value={item.e} className="form-control" style={{ width: '460px' }} />
                          </td>
                        </tr>
                      </div>
                    </div>
                  ))
                }

                <button onClick={this.onClickTambahPertanyaan} className="btn btn-v2 btn-icademy-grey" style={{ width: '100%' }}><i className="fa fa-plus"></i> Add Question</button>

                <button
                  type="button"
                  className="btn btn-icademy-primary m-2 float-right"
                  onClick={this.state.update ? this.updateKuesioner.bind(this) : this.saveKuesioner.bind(this)}
                >
                  <i className="fa fa-save"></i>
                      Save
                    </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
}
