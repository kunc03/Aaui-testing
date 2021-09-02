import React, { Component } from 'react';
import { Fragment } from 'react';
import WebinarLive from './live';
import Storage from '../../../repository/storage';


export default class WebinarLivePublic extends Component {

	state = {
		session: Storage.get('user').data
  }

	render() {
		const { session } = this.state

		return (
			<Fragment>
				{
					session ?
						<Fragment>
							<div className="pcoded-main-container">
								<div className="pcoded-wrapper">
									<div className="pcoded-content" style={{padding: '20px 20px 0 20px'}}>
										<div className="pcoded-inner-content">
											<div className="main-body">
												<div className="page-wrapper">
													<WebinarLive webinarId={this.props.match.params.webinarId} voucher={this.props.match.params.voucher} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Fragment>
					:
					<WebinarLive webinarId={this.props.match.params.webinarId} voucher={this.props.match.params.voucher}/>
				}
			</Fragment>
		);
	}

}