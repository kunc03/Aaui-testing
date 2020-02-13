
import API, {FORUM, USER_ME} from '../../repository/api';
import Storage from '../../repository/storage';
import ReactDOM from 'react-dom';

export function _postLIstAllForum(){
   // console.log('get') localStorage.setItem('role', data.role) 
   let getEmailLocal = JSON.parse(localStorage.getItem('user')).data.email;
   //console.log(getEmailLocal)
    API.get(`${USER_ME}${getEmailLocal}`).then(res=>{
      if(res.status === 200){
        if(!res.data.error){
            this.setState({company_id: res.data.result.company_id})
        }
      }
    })
    .then(() => {
      console.log(`${FORUM}/company/${this.state.company_id}`);
      API.get(`${FORUM}/company/${this.state.company_id}`).then(res=> {
        console.log(res.data)
          if(res.status === 200){
            if(!res.data.error){
                this.setState({ forums: res.data.result })
            }
          }
        })
    })
    .catch(err=> {
      console.log(err);
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
        company_id : stateCopy.company_id,
        user_id : stateCopy.user_id,
        title : stateCopy.title,
        body : stateCopy.body,
        tags : stateCopy.tags,
    };
    
    API.post(`${FORUM}`, user_data).then(res=> {
      console.log(res.data)
        if(res.status === 200){
          if(!res.data.error){
            this.setState({
                isForumAdd: false
            })
          }
        }
      })
      .catch(err=> {
        console.log(err);
      })
    //console.log(stateCopy);
};

export function _komentarPost(){
  //console.log(this.state, "koment coiisgg")
  let user_data = {
    forum_id: this.state.forumId,
    user_id: this.state.user_id,
    konten: this.state.kontent,
  }
  API.post(`${FORUM}-post`, user_data).then(res=> {
    console.log(res.data)
      if(res.status === 200){
        if(!res.data.error){
          // listKomentar: res.data.result 
          // response komentar harusnya array tapi disini yg saya terima object
          _getDetailForumList.bind(this)
          this.setState({
            kontent : '',
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