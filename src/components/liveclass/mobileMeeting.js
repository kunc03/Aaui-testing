import React, { Component } from "react";
import {isIOS} from 'react-device-detect';

export default class LiveStream extends Component {
	state = {
    }
 

	render() {
        let plainURL = decodeURIComponent(this.props.match.params.url);
        let lengthURL = plainURL.length;
        let iosURL = 'icademy'+plainURL.slice(5, lengthURL)
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
                    You need the ICADEMY application to be able to join meetings.
                </div>
                <div className="col-sm-12" style={{textAlign:'center', marginTop:20}}>
                    <a style={{backgroundColor:'#2f6fca', color:'#FFF', padding:10}} href={isIOS ? 'https://apps.apple.com/id/app/icademy/id1546069748#?platform=iphone' : 'https://play.google.com/store/apps/details?id=id.app.icademy'}>Download Apps</a>
                </div>
                <div className="col-sm-12" style={{textAlign:'center', marginTop:20}}>
                    <a style={{padding:10, color:'#2f6fca'}} href={isIOS ? iosURL : plainURL}>Open Apps</a>
                </div>
            </div>
		);
	}
}