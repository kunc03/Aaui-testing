import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, {API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Laporan extends React.Component {

  state = {
    nilaiMurid: []
  }

  componentDidMount() {
    this.fetchNilai()
  }

  fetchNilai() {
    let data = [
      {id: 1, mata_pelajaran: "Matematika", nilai_rata: 98.2, nilai_tugas: 88, nilai_uts: 80, nilai_uas: 90, persensi: '95%'},
      {id: 2, mata_pelajaran: "Fisika", nilai_rata: 93.2, nilai_tugas: 89, nilai_uts: 90, nilai_uas: 80, persensi: '98%'},
      {id: 2, mata_pelajaran: "Bahasa Indonesia", nilai_rata: 91.2, nilai_tugas: 90.5, nilai_uts: 95, nilai_uas: 80, persensi: '96%'},
    ];
    this.setState({ nilaiMurid: data })
  }

  render() {
    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Laporan / Raport Murid</div>

            <div className="card-body">
              <form>
                <div className="form-group row">
                  <div className="col-sm-2">
                    <label>Tahun Pelajaran</label>
                    <select className="form-control" required>
                      <option value="" selected disabled>Pilih</option>
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Kelas</label>
                    <select className="form-control" required>
                      <option value="" selected disabled>Pilih</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <label>Nama Murid</label>
                    <select className="form-control" required>
                      <option value="" selected disabled>Pilih</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-12">
                    <label>Penerima</label><br/>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" value="" /> Option 1
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" value=""/> Option 2
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group row mt-4">
                  <div className="col-sm-12">
                    <button type="submit" className="btn btn-v2 btn-primary"><i className="fa fa-paper-plane"></i> Kirim</button>
                  </div>
                </div>
              </form>

              <form onSubmit={this.simpanData} className="mt-4">
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">NO INDUK</label>
                  <div className="col-sm-4">
                    <input type="text" value={'2103151036'} disabled className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">NAMA</label>
                  <div className="col-sm-4">
                    <input type="text" value={'Ahmad Ardiansyah'} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">KELAS</label>
                  <div className="col-sm-4">
                    <input type="text" value={'I RPL'} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">SEMESTER</label>
                  <div className="col-sm-4">
                    <input type="text" value={'Semester 1'} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">TAHUN PELAJARAN</label>
                  <div className="col-sm-4">
                    <input type="text" value={'2019/2020'} className="form-control" />
                  </div>
                </div>
              </form>

              <table className="table table-striped mt-4 table-bordered">
                <thead>
                  <tr className="text-center">
                    <td style={{verticalAlign: 'middle'}} rowSpan="2">NO</td>
                    <td style={{verticalAlign: 'middle'}}  rowSpan="2">MATA PELAJARAN</td>
                    <td style={{verticalAlign: 'middle'}}  rowSpan="2">NILAI RATA-RATA</td>
                    <td colSpan="3">NILAI HASIL BELAJAR</td>
                    <td style={{verticalAlign: 'middle'}}  rowSpan="2">PERSENSI</td>
                  </tr>
                  <tr className="text-center">
                    <td>TUGAS</td>
                    <td>UTS</td>
                    <td>UAS</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.nilaiMurid.map((item,i) => (
                      <tr className="text-center">
                        <td>{i+1}</td>
                        <td>{item.mata_pelajaran}</td>
                        <td>{item.nilai_rata}</td>
                        <td>{item.nilai_tugas}</td>
                        <td>{item.nilai_uts}</td>
                        <td>{item.nilai_uas}</td>
                        <td>{item.persensi}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Laporan;
