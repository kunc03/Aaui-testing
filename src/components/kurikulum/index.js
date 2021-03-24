import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import { Accordion, Card, ListGroup, Modal } from 'react-bootstrap'

class Registasi extends React.Component {

  state = {
    kurikulum: [],

    id: '',
    name: '',

    formAdd: false,

    formLesson: false,
    optionLessons: [],
    lessonIds: [],

    listPelajaran: [],
  }

  componentDidMount() {
    this.fetchPelajaran()
    this.fetchKurikulum()
  }

  saveKurikulum = e => {
    let { value } = e.target;
    let form = {
      company_id: Storage.get('user').data.company_id,
      name: this.state.name
    }

    if(this.state.id) {
      API.put(`${API_SERVER}v2/kurikulum/${this.state.id}`, form).then(res => {
        if(res.data.error) toast.warning(`Error update kurikulum`)

        this.fetchKurikulum();
      })
    } else {
      API.post(`${API_SERVER}v2/kurikulum`, form).then(res => {
        if(res.data.error) toast.warning(`Error save kurikulum`)

        this.fetchKurikulum();
      })
    }
    this.setState({ formAdd: false, name: '', id: '' })
  }

  fetchKurikulum() {
    API.get(`${API_SERVER}v2/kurikulum/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kurikulum");

      this.setState({ kurikulum: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");

      let reformat = res.data.result.map((item) => {
        return {
          value: item.pelajaran_id,
          label: item.kode_pelajaran + ' - ' + item.nama_pelajaran
        }
      })

      this.setState({ optionLessons: reformat })
    })
  }

  selectKurikulum = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')
    this.setState({ id, name, formAdd: true })
  }

  deleteKurikulum = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    API.delete(`${API_SERVER}v2/kurikulum/${id}`).then(res => {
      if (res.data.error) toast.warning("Error delete data kurikulum");
      this.fetchKurikulum()
    })
  }

  addMapel = e => {
    e.preventDefault()
    let form = {
      mapel: this.state.lessonIds
    }

    API.post(`${API_SERVER}v2/kurikulum/${this.state.id}/mapel`, form).then(res => {
      if (res.data.error) toast.warning("Error add data pelajaran");
      this.fetchKurikulum()
      this.setState({ formLesson: false, id: '', lessonIds: [] })
    })
  }

  formAddMapel = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let filter = this.state.kurikulum.filter(item => item.id == parseInt(id))[0];
    let temp = [];
    if(filter.mapel.length) {
      for(var i=0; i<filter.mapel.length; i++) {
        temp.push(filter.mapel[i].pelajaran_id)
      }
    }
    this.setState({ id, formLesson: true, lessonIds: temp })
  }

  deleteMapel = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-kurikulum')
    let mapel = e.target.getAttribute('data-mapel')
    API.delete(`${API_SERVER}v2/kurikulum/${id}/mapel/${mapel}`).then(res => {
      this.fetchKurikulum()
    })
  }

  render() {
    const { kurikulum, listPelajaran } = this.state;

    return (
      <div className="row mt-3">
        <div className="col-sm-12">

          <Card>
            <Card.Header>
              <h4>Kurikulum
              <button onClick={e => this.setState({ formAdd: true })} className="btn btn-v2 btn-primary float-right"><i className="fa fa-plus"></i> Add</button>
              </h4>
            </Card.Header>
            <Card.Body>

              <Accordion defaultActiveKey="0">
                {
                  kurikulum.map((item,i) => (
                    <Card>
                      <Card.Header>
                        <h5 className="collapsed" data-toggle="collapse" data-target={`#colp${i}`} style={{cursor: 'pointer'}}>
                          <i className="fa"></i> {' '}
                          {item.name}
                        </h5>
                        <button onClick={this.formAddMapel} data-id={item.id} className="btn btn-v2 btn-primary float-right">Lesson</button>
                        <i onClick={this.selectKurikulum} data-id={item.id} data-name={item.name} style={{cursor: 'pointer'}} className="fa fa-edit mr-2"></i>
                        <i onClick={this.deleteKurikulum} data-id={item.id} style={{cursor: 'pointer'}} className="fa fa-trash"></i>
                      </Card.Header>
                      <Card.Body className="collapse p-2" id={`colp${i}`}>
                        <ListGroup>
                          {
                            item.mapel.map((row,j) => (
                              <ListGroup.Item key={j}>{row.nama_pelajaran} <i onClick={this.deleteMapel} data-kurikulum={item.id} data-mapel={row.pelajaran_id} className="fa fa-trash float-right"></i></ListGroup.Item>
                            ))
                          }
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  ))
                }
              </Accordion>

            </Card.Body>
          </Card>

          <Modal show={this.state.formAdd} onHide={() => this.setState({ formAdd: false, name: '', id: '' })}>
            <Modal.Body>
              <div className="form-group">
                <label>Name</label>
                <input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} className="form-control" name="kurikulum" />
              </div>
              <div class="form-group">
                <button onClick={this.saveKurikulum} className="btn btn-v2 btn-primary">Save</button>
              </div>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.formLesson} onHide={() => this.setState({ formLesson: false, lessonIds: [], id: '' })}>
            <Modal.Body>
              <div className="form-group">
                <label>Lessons</label>
                <MultiSelect
                  id={`lessonId`}
                  options={this.state.optionLessons}
                  value={this.state.lessonIds}
                  onChange={lessonIds => this.setState({ lessonIds })}
                  mode="list"
                  enableSearch={true}
                  resetable={true}
                  valuePlaceholder="Pilih"
                  allSelectedLabel="Semua"
                />
              </div>
              <div class="form-group">
                <button onClick={this.addMapel} className="btn btn-v2 btn-primary">Add</button>
              </div>
            </Modal.Body>
          </Modal>

        </div>
      </div>
    );
  }

}

export default Registasi;
