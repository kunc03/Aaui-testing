import React from 'react';

// const hari = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
// const jam = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

class EvaluasiDetail extends React.Component {
  state = {
    listResponden: []
  }

  componentDidMount() {
    let list = [
      {id: 1, nama_murid: 'Ahmad', tanggal: '11 Sep 2020', jam_submit: '13:00', status: 'Submited'},
      {id: 2, nama_murid: 'Ardi', tanggal: '11 Sep 2020', jam_submit: '13:20', status: 'Submited'},
    ];
    this.setState({ listResponden: list })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Evaluasi Untuk Guru
            </div>
            <div className="card-body" style={{padding: '5px'}}>

              <ul className="nav nav-tabs nav-justified">
                <li class="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#home">Daftar Responden</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu1">Statistik</a>
                </li>
              </ul>

              <div class="tab-content" style={{padding: '20px'}}>
                <div class="tab-pane active" id="home">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Murid</th>
                        <th>Tanggal</th>
                        <th>Jam Submit</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.listResponden.map((item, i) => (
                          <tr key={item.id}>
                            <td>{i+1}</td>
                            <td>{item.nama_murid}</td>
                            <td>{item.tanggal}</td>
                            <td>{item.jam_submit}</td>
                            <td>{item.status}</td>
                            <td>
                              <button type="button" className="btn btn-v2 btn-primary">
                                <i className="fa fa-search"></i> Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>

                <div className="tab-pane fade" id="menu1">Stat</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default EvaluasiDetail;
