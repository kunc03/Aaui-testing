import React, { Component } from 'react';

export default class ThankYou extends Component {
	render() {
		return (
			<div style={{position:'fixed', zIndex:1028, left:0, top:0, background:'#FFF', width:'100%', height:'100%', padding:'5%'}}>
                <center>
                <h4>Thank you for using ICADEMY.</h4>
                <h4>See you soon !</h4>
                <img src='newasset/see-you.png' style={{height:'25%'}} />
                </center>
			</div>
		);
	}

}