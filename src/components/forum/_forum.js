import React, { Component } from "react";
import {Alert, Modal, Form} from 'react-bootstrap';
import API, {FORUM, API_SERVER, USER_ME} from '../../repository/api';
import Storage from '../../repository/storage';
import ReactDOM from 'react-dom';

export function _postLIstAllForum(){
  API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
    this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
    let listaAPi = `${FORUM}/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`;
    API.get(listaAPi).then(res=> {
        //console.log(res, 'ress')
          let aray = [],starData = [];
          let splitTags; 
          for(let a in res.data.result){
            starData.push(res.data.result[a]);
            splitTags = res.data.result[a].tags.split(",");
            for(let b in splitTags){
              aray.push({tags:splitTags[b]}) 
            }
          }

          if(res.status === 200){
            if(!res.data.error){
              API.get( `${FORUM}/list/${this.state.user_id}`).then(starListt=> {
                console.log(res, 'starListts')
                  if(starListt.data.result.length !== 0){
                    for(let a in starListt.data.result){
                      for(let b in res.data.result){
                        //console.log(starListt.data.result[a].forum_id, 'listtt');
                          if(starListt.data.result[a].forum_id === res.data.result[b].forum_id){
                            res.data.result[b].status = true;
                          }else{
                            res.data.result[b].status = false;
                          }
                        }
                      }
                    }
                    this.setState({ forumlist: res.data.result, forumListStar: starListt.data.result, listTags:aray })
                
              })
                //this.setState({ forumlist: res.data.result, listTags:aray })
            }
          }
        })
        .catch(err=> {
          console.log(err);
        })
  })
}

export function _postStarForum(){
  API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
    this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
    let listaAPi = `${FORUM}/list/${this.state.user_id}`;
    API.get(listaAPi).then(res=> {
        //console.log(res, 'ress')
          let aray = [],starData = [];
          let splitTags; 
          for(let a in res.data.result){

            
            starData.push(res.data.result[a]);
            splitTags = res.data.result[a].tags.split(",");
            for(let b in splitTags){
              aray.push({tags:splitTags[b]}) 
            }
          }

          if(res.status === 200){
            if(!res.data.error){
              
                this.setState({ forumlist: this.state.forumlist, forumListStar: res.data.result, listTags:aray })
            }
          }
        })
        .catch(err=> {
          console.log(err);
        })
  })
}

export function _addStarForum(forumId, userId){
  API.post(`${FORUM}/add/`, {forum_id: forumId, user_id: userId})
    .then(res => {
      console.log(res, 'responseeee add')
      //this.setState({isLockedStatus : res.data.result.kunci},console.log(res.data.result.kunci,"35546456")); 
    })
    .catch(err => console.log("ioOOIAOIs",err))
}

export function _deleteStarForum(forumId, userId) {
  API.delete(`${FORUM}/remove/`, {forum_id: forumId, user_id: userId})
  .then(res => {
    console.log(res, 'responseeee delet')
    //this.setState({isLockedStatus : res.data.result.kunci},console.log(res.data.result.kunci,"35546456")); 
  })
  .catch(err => console.log("ioOOIAOIs",err))
}

export function _getDetailForumList(idForum){
  //console.log(idForum, 'ID >>>>>>>>>>>>>>>>>>>>>>>');
  API.get(`${FORUM}/id/${idForum}`).then(res=> {
     console.log(res)
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
   // console.log(e);
    let stateCopy = this.state,
    user_data = {
        company_id: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : stateCopy.companyId,
        user_id : stateCopy.user_id,
        title : stateCopy.title,
        body : stateCopy.body,
        tags : stateCopy.tags,
    };
    
    API.post(`${FORUM}`, user_data).then(res=> {
      //console.log(res.data)
        if(res.status === 200){
          if(!res.data.error){
            if(stateCopy.imgFile !== "") {
              let formData = new FormData();
              formData.append('cover', stateCopy.imgFile);
              API.put(`${FORUM}/cover/${res.data.result.forum_id}`, formData)
            }

            API.get(`${USER_ME}${Storage.get("user").data.email}`).then(res => {
              this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
              API.get(`${FORUM}/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`)
                .then(res => {
                  console.log("res: ", res.data.result);
                  if (res.status === 200) {
                    if (!res.data.error) {
                      this.setState({
                        forumlist: res.data.result,
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
    //console.log(stateCopy);
};

export function _komentarPost(){
  //console.log(Storage.get('user').data.avatar , "koment coiisgg");
  
  let user_data = {
    forum_id: this.state.forumId,
    user_id: this.state.user_id,
    konten: this.state.kontent,
  }
  API.post(`${FORUM}-post`, user_data).then(res=> {
    
      if(res.status === 200){
        if(!res.data.error){
          let komentar = this.state.listKomentar;
          res.data.result.avatar = Storage.get('user').data.avatar;
          res.data.result.name = Storage.get('user').data.user;
          let newKomentar = [...komentar, res.data.result]
           console.log(newKomentar)
          _getDetailForumList.bind(this)
          this.setState({
            kontent : '',
            listKomentar : newKomentar
          })
        }
      }
    })
    .catch(err=> {
      console.log(err);
    })
}

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