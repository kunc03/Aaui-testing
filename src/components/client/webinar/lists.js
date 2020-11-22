import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Lists extends Component {

	state = {}

	render() {
		const items = this.props.items;
		const headers = ["Nama Webinar", "Pembicara", "Status", "Time", "Date", "Peserta", "Attachment", "Action"];

		return (
			<table className="table table-striped">
				<thead>
					<tr>
						{
							headers.map(item => (
								<th>{item}</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
						items.map((item, i) => (
							<tr>
								<td>{item.name}</td>
								<td>{item.pembicara}</td>
								<td>{item.status}</td>
								<td>{item.waktu}</td>
								<td>{item.tanggal}</td>
								<td>{item.peserta}</td>
								<td>
									<a href="#" style={{ border: '1px solid #e9e9e9', borderRadius: '8px', padding: '8px' }}>
										<i className="fa fa-download"></i> Download
									</a>
								</td>
								<td>
									{
										item.status != "Selesai" &&
										<Link to="/webinar/live" className="btn btn-sm btn-primary mr-2" style={{
											borderRadius: '25px',
											padding: '5px 12px'
										}}>
											<i className="fa fa-share"></i> Entry
									</Link>
									}
									{
										item.status == "Selesai" &&
										<Link to="/webinar/riwayat" className="btn btn-sm btn-primary mr-2" style={{
											borderRadius: '25px',
											padding: '5px 12px'
										}}>
											<i className="fa fa-history"></i> History
										</Link>
									}
									<i className="fa fa-edit mr-2" style={{ cursor: 'pointer' }}></i>
									<i className="fa fa-trash mr-2" style={{ cursor: 'pointer' }}></i>
								</td>
							</tr>
						))
					}
				</tbody>
			</table>
		);
	}

}

export default Lists;