import React, { Component } from 'react';
import API, { API_SERVER } from '../../../repository/api';
import { toast } from "react-toastify";

export default class WebinarKuesionerAdd extends Component {

	state = {
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

  handleDynamicInput = (e, i) => {
    const { value, name } = e.target;
    let newObj = [...this.state.pertanyaan];

    newObj[i][name] = value;
    this.setState({ pertanyaan: newObj });
  }

  onClickHapusPertanyaan = (e) => {
		let dataIndex = e.target.getAttribute('data-id');
		let dataID = e.target.getAttribute('data-index');
		API.delete(`${API_SERVER}v2/kuesioner/pertanyaan/${dataIndex}`).then(res => {
			if(res.data.error) toast.warning("Gagal menghapus data");

			toast.success("Data kuesioner terhapus")
			let kurangi = this.state.pertanyaan.filter((item, i) => i !== parseInt(dataID));
			this.setState({
				pertanyaan: kurangi
			})
		})
  }

  saveKuesioner(){
    let form = {
      id: this.state.webinarId,
      kuesioner: this.state.pertanyaan,
    };

    API.post(`${API_SERVER}v2/kuesioner`, form).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error post data')
        } else {
          toast.success(`Menyimpan kuesioner`)
          this.props.closeModal()
        }
      }
    })
  }

	updateKuesioner(){
    let form = {
      id: this.state.webinarId,
      kuesioner: this.state.pertanyaan,
    };

    API.put(`${API_SERVER}v2/kuesioner`, form).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error post data')
        } else {
          toast.success(`Menyimpan kuesioner`)
          this.props.closeModal()
        }
      }
    })
  }

  fetchData(){
    API.get(`${API_SERVER}v2/kuesioner/${this.state.webinarId}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({pertanyaan: res.data.result})
          if (this.state.pertanyaan.length <= 0){
            this.setState({update: false})
          }
          else{
            this.setState({update: true})
          }
        }
      }
    })
  }

  componentDidMount(){
    this.fetchData()
  }

	submitImport = e => {
		e.preventDefault();
		this.setState({ loading: true });
		let form = new FormData();
		form.append('webinarId', this.state.webinarId);
		form.append('excel', this.state.formFile);

		API.post(`${API_SERVER}v2/kuesioner/import`, form).then(res => {
			if(res.data.error) toast.warning("Error import data");

			toast.success("Berhasil import kuesioner")
			this.setState({ loading: false })
			this.fetchData();
		})
	}

	render() {

		console.log('STATE: ', this.state);

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
              <div style={{marginTop: '10px'}}>
								<form onSubmit={this.submitImport} role="form" className="form-vertical">
									<div className="form-group row">
										<div className="col-sm-3">
											<label>Template Excel</label>
											<a href={`${API_SERVER}attachment/template.xlsx`} target="_blank" className="btn btn-primary">Download</a>
										</div>
										<div className="col-sm-6">
											<label>Import Excel</label>
											<input required onChange={e => this.setState({ formFile: e.target.files[0] })} className="form-control" type="file" />
										</div>
										<div className="col-sm-3">
											<button style={{marginTop: '22px'}} className="btn btn-primary" type="submit">
												<i className="fa fa-save"></i> {this.state.loading ? "Sedang proses..." : "Simpan" }
											</button>
										</div>
									</div>
								</form>

                <div className="row mt-4">
                  <div className="col-sm-12">

                    {
                      this.state.pertanyaan.map((item,i) => (
                        <div className="form-group">
                          <label>Pertanyaan {i+1}</label>
                          <span className="float-right">
                            <i data-index={i} data-id={item.id} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                          </span>
                          <textarea onChange={e => this.handleDynamicInput(e, i)} name="tanya" className="form-control" rows="3" value={item.tanya} />

                          <div className="jawaban mt-3 ml-4">
                            <label>Tambahkan Jawaban Kuesioner</label>
                            <tr>
                              <td>
                                A
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="a" value={item.a} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                B
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                C
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                D
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="d" value={item.d} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                E
                              </td>
                              <td>
                                <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="e" value={item.e} className="form-control" style={{width: '460px'}} />
                              </td>
                            </tr>
                          </div>
                        </div>
                      ))
                    }

                    <button onClick={this.onClickTambahPertanyaan} className="btn btn-v2 btn-icademy-grey" style={{width:'100%'}}><i className="fa fa-plus"></i> Tambah Pertanyaan</button>

                    <button
                      type="button"
                      className="btn btn-icademy-primary m-2 float-right"
                      onClick={this.state.update ? this.updateKuesioner.bind(this) : this.saveKuesioner.bind(this)}
                    >
                      <i className="fa fa-save"></i>
                      Simpan
                    </button>
                  </div>
                </div>

              </div>

        </div>
      </div>
		);
	}
}
