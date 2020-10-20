import React from 'react';
import { API_SERVER } from '../../repository/api';

class Guru extends React.Component {

  state = {
    dataGuru: []
  }

  render() {
    return (
      <>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Import Data Guru</div>
            <div className="card-body" style={{padding: '5px'}}>
              <form>
                <div className="form-group row" style={{padding: '20px'}}>
                  <div className="col-sm-3">
                    <label>Template Excel</label><br/>
                    <a href={`${API_SERVER}attachments/template-upload.xlsx`} className="btn btn-v2 btn-primary">Download File</a>
                  </div>
                  <div className="col-sm-6">
                    <label>Pilih File</label>
                    <input className="form-control" type="file" />
                  </div>
                  <div className="col-sm-3">
                    <button style={{marginTop: '28px'}} className="btn btn-v2 btn-success" type="submit">Upload File</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Daftar Guru Sekolah</div>
            <div className="card-body">

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>No. Induk</th>
                    <th>Tempat Lahir</th>
                    <th>Tanggal Lahir</th>
                    <th>Jenis Kelamin</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.dataGuru.map((item, i) => (
                      <tr>
                        <td>{i+1}</td>
                        <td>{item.nama}</td>
                        <td>{item.no_induk}</td>
                        <td>{item.tempat_lahir}</td>
                        <td>{item.tanggal_lahir}</td>
                        <td>{item.jenis_kelamin}</td>
                        <td>
                          <i className="fa fa-ellipsis-v"></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Guru;
