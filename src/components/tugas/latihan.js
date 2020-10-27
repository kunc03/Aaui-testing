import React from 'react';

class Latihan extends React.Component {

  state = {
    mataPelajaran: [],

  }

  componentDidMount() {
    let mataPelajaran = [
      {mapel: 'Pendidikan Agama', topik: 'Pahala itu apa ?', percobaan: 4, nilai: '8/10', status: 'Terbuka'},
      {mapel: 'Pendidikan Pancasila', topik: 'Pahala itu apa ?', percobaan: 2, nilai: '7/10', status: 'Terbuka'},
      {mapel: 'Matematika', topik: 'Pahala itu apa ?', percobaan: 1, nilai: '9/10', status: 'Tertutup'},
    ];
    this.setState({ mataPelajaran })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{padding: '12px'}}>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Mata Pelajaran</th>
                    <th>Topik</th>
                    <th>Percobaan</th>
                    <th>Nilai</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.mataPelajaran.map((item,i) => (
                      <tr>
                        <td>{item.mapel}</td>
                        <td>{item.topik}</td>
                        <td>{item.percobaan}</td>
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

export default Latihan;
