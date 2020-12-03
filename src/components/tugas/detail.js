import React from 'react';

class Ujian extends React.Component {

  state = {
    mataPelajaran: [],

  }

  componentDidMount() {
    let mataPelajaran = [
      { tanggal: '20 Oktober 2020', waktu: '07:00', mapel: 'Pendidikan Agama', durasi: '60 menit', nilai: '9/10', status: 1 },
      { tanggal: '16 Oktober 2020', waktu: '08:00', mapel: 'Pendidikan Pancasila', durasi: '60 menit', nilai: '8.5/10', status: 2 },
      { tanggal: '10 Oktober 2020', waktu: '09:00', mapel: 'Ilmu Pengetahuan Alam', durasi: '60 menit', nilai: '8/10', status: 3 },
    ];
    this.setState({ mataPelajaran })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{ padding: '12px' }}>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th> Date </th>
                    <th>Time </th>
                    <th> Subject </th>
                    <th> Duration </th>
                    <th> Value </th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.mataPelajaran.map((item, i) => (
                      <tr>
                        <td>{item.tanggal}</td>
                        <td>{item.waktu}</td>
                        <td>{item.mapel}</td>
                        <td>{item.durasi}</td>
                        <td>{item.nilai}</td>
                        <td>{item.status}</td>
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

export default Ujian;
