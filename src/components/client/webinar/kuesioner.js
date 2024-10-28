import React, { Component } from 'react';
import { Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WebinarKuesioner extends Component {

  state = {
    kuesioner: [
      { id: 1, nama: 'Ahmad', tanggal: '03 Sep 2020', jam: '09:05', via: 'Login' },
      { id: 2, nama: 'Ardi', tanggal: '03 Sep 2020', jam: '09:10', via: 'Voucher' },
      { id: 3, nama: 'Ansyah', tanggal: '03 Sep 2020', jam: '09:04', via: 'Login' },
      { id: 4, nama: 'Arra', tanggal: '03 Sep 2020', jam: '09:03', via: 'Voucher' },
    ],

    idDetail: '',
    isModalDetail: false
  }

  handleModal = () => {
    this.setState({
      idDetail: '',
      isModalDetail: false
    });
  }

  render() {

    const TabelKuesioner = ({ items }) => (
      <table className="table table-striped">
        <thead>
          <tr>
            <th> Name </th>
            <th> Date </th>
            <th>Jam Submit</th>
            <th>Via</th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, i) => (
              <tr>
                <td>{item.nama}</td>
                <td>{item.tanggal}</td>
                <td>{item.jam}</td>
                <td>{item.via}</td>
                <td>
                  <button onClick={e => this.setState({ isModalDetail: true, idDetail: item.id })} className="btn btn-v2 btn-primary"><i className="fa fa-search"></i> Detail</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const ModalDetail = ({ id }) => (
      <Modal
        show={this.state.isModalDetail}
        onHide={this.handleModal}
        dialogClassName="modal-lg"
      >
        <Modal.Body>
          <h5>
            Ahmad Ardiansyah
          </h5>
          <p>The results of the Feedback Form that had been input by the participants.</p>

          <div style={{ marginTop: "20px" }} className="form-group">

          </div>

          <button
            type="button"
            className="btn btn-v2 f-w-bold"
            onClick={this.handleModal}
          >
            Close
          </button>
        </Modal.Body>
      </Modal>
    );

    return (
      <div className="row">
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    <Link to={`/webinar/riwayat/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                      border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                    }}>
                      <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                    </Link>
                    Feedback Form Result
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div className="row">
                  <div className="col-sm-12">

                    <TabelKuesioner items={this.state.kuesioner} />

                  </div>
                </div>

              </div>
            </Card.Body>
          </Card>

          <ModalDetail />
        </div>
      </div>
    );
  }
}