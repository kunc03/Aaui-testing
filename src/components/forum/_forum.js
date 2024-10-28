import API, {FORUM, USER_ME} from '../../repository/api';
import Storage from '../../repository/storage';
import ReactDOM from 'react-dom';

export function _postLIstAllForum(){
  API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
    this.setState({companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
    let listaAPi = `${FORUM}/company/${this.state.companyId}/${res.data.result.user_id}`;
    //let listaAPi2 = `${FORUM}/${this.state.user_id}`;
    
    console.log(listaAPi, 'proppss')
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
              console.log(res.data.result, 'data forumm')
              this.setState({ forumlist: res.data.result, listTags:aray })
            }
          }
        })
        .catch(err=> {
          console.log(err);
        })
  })
}

export function _getDetailForumList(idForum){
  console.log(idForum, 'ID >>>>>>>>>>>>>>>>>>>>>>>');
  API.get(`${FORUM}/id/${idForum}/${this.state.user_id}`).then(res=> {
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
    let stateCopy = this.state,
    user_data = {
      company_id: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : stateCopy.companyId,
      user_id : stateCopy.user_id,
      title : stateCopy.title,
      body : stateCopy.body,
      tags : stateCopy.tags,
    };
    console.log(user_data);
    
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
              let listaAPi = `${FORUM}/company/${this.state.companyId}/${res.data.result.user_id}`;
              API.get(listaAPi)
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