import React, { Component } from "react";
import {Alert, Modal, Form} from 'react-bootstrap';
import API, {FORUM, API_SERVER, USER_ME} from '../../repository/api';
import Storage from '../../repository/storage';
import ReactDOM from 'react-dom';

export function _postLIstAllForum(){
   // console.log('get')
  API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
    this.setState({ companyId: res.data.result.company_id })
    API.get(`${FORUM}/company/${res.data.result.company_id}`).then(res=> {
        console.log('res: ', res.data.result)
          if(res.status === 200){
            if(!res.data.error){
                this.setState({ forums: res.data.result })
            }
          }
        })
        .catch(err=> {
          console.log(err);
        })
  })
}

export function _getDetailForumList(idForum){
  //console.log(idForum, 'ID >>>>>>>>>>>>>>>>>>>>>>>');
  API.get(`${FORUM}/id/${idForum}`).then(res=> {
     //console.log(res)
      if(res.status === 200){
        if(!res.data.error){
            this.setState({ listDetail: res.data.result, listKomentar: res.data.result[0].komentar })
        }
      }
    })
    .catch(err=> {
      console.log(err);
    })
}

export function _addforum(e) {
    e.preventDefault();
    console.log(e);
    let stateCopy = this.state,
    user_data = {
        company_id : stateCopy.companyId,
        user_id : stateCopy.user_id,
        title : stateCopy.title,
        body : stateCopy.body,
        tags : stateCopy.tags,
    };
    
    API.post(`${FORUM}`, user_data).then(res=> {
      console.log(res.data)
        if(res.status === 200){
          if(!res.data.error){
            if(stateCopy.imgFile !== "") {
              let formData = new FormData();
              formData.append('cover', stateCopy.imgFile);
              API.put(`${FORUM}/cover/${res.data.result.forum_id}`, formData)
            }

            API.get(`${USER_ME}${Storage.get("user").data.email}`).then(res => {
              this.setState({ companyId: res.data.result.company_id });
              API.get(`${FORUM}/company/${res.data.result.company_id}`)
                .then(res => {
                  console.log("res: ", res.data.result);
                  if (res.status === 200) {
                    if (!res.data.error) {
                      this.setState({
                        forums: res.data.result,
                        isForumAdd: false,
                        imgFile: "",
                        imgPreview: ""
                      });
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            });

          }
        }
      })
      .catch(err=> {
        console.log(err);
      })
    console.log(stateCopy);
};

export function _handleKeyPress(key, target) {
	if(key.charCode === 13){
		key.preventDefault()
		if(target instanceof Function) {
			target();
		} else {
			let node = ReactDOM.findDOMNode(target);
			if (node && node.focus instanceof Function) node.focus();
		};
	};
};