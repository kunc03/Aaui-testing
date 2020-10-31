import React, { Component } from "react";
import {isIOS} from 'react-device-detect';

export default class LiveStream extends Component {
	state = {
    }
 

	render() {

		return(
            <div className="row">
                <div className="col-sm-12">
                    <img
                      src={`assets/images/component/logo-icademy.png`}
                      alt=""
                      style={{width:'90%', height:'auto',paddingLeft:'5%'}}
                    />
                </div>
                <div className="col-sm-12" style={{textAlign:'center', marginTop:20}}>
                    Anda butuh aplikasi ICADEMY untuk dapat join meeting.
                </div>
                <div className="col-sm-12" style={{textAlign:'center', marginTop:20}}>
                    <a style={{backgroundColor:'#2f6fca', color:'#FFF', padding:10}} href={isIOS ? 'https://app.icademy.id/icademy.apk' : 'https://app.icademy.id/icademy.apk'}>Download Aplikasi</a>
                </div>
                <div className="col-sm-12" style={{textAlign:'center', marginTop:20}}>
                    <a style={{padding:10, color:'#2f6fca'}} href={decodeURIComponent(this.props.match.params.url)}>Buka Aplikasi</a>
                </div>
            </div>
		);
	}
}