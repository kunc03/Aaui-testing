import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { Link } from "react-router-dom";

class ViewNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
        edited: false,
        id: this.props.match.params.id ? this.props.match.params.id : '',
        companyId:'',
        image:'',
        imagePreview:'assets/images/no-image.png',
        isSaving: false,
        userId: '',
        content:'Loading...',
        title: '',
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,
        author:'',
        created_at: ''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }


handleContent = (e) => {
    this.setState({ content: e, edited:true });
}
  handleChange = e => {
    this.setState({edited: true})
      let {name, value} = e.target;
      if (name==='image'){
        if (e.target.files.length){
            if (e.target.files[0].size <= 5000000) {
                let image = {
                    image: e.target.files[0],
                    imagePreview: URL.createObjectURL(e.target.files[0])
                }
                this.setState(image)
            } else {
              e.target.value = null;
              toast.warning('Image size cannot larger than 5MB and must be an image file')
            }
        }
      }
      else{
          this.setState({[name]: value})
      }
  }
  getData(id){
    API.get(`${API_SERVER}v2/news/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read news')
        }
        else{
            this.setState({
                id: res.data.result.id,
                content: res.data.result.content,
                title: res.data.result.title,
                imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview,
                author: res.data.result.author,
                created_at: moment.tz(res.data.result.created_at, moment.tz.guess(true)).format("MMMM Do YYYY, h:mm:ss a")
            })
        }
    })
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
        }
    })
  }
  componentDidMount(){
    this.getUserData();
    if (this.props.disabledForm && this.props.id){
        this.getData(this.props.id);
    }
    else if (this.props.match.params.id){
        this.getData(this.props.match.params.id);
    }
    else{
        this.setState({
            content : ''
        })
    }
  }

  clearSessionForm(){
    this.setState({
        edited: false,
        content : ''
      })
  }

  render() {
    let {session, media} = this.state;
    return(
        <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
                <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                        <div className="main-body">
                            <div className="page-wrapper">
                                <div className="floating-back">
                                    <img
                                    src={`newasset/back-button.svg`}
                                    alt=""
                                    width={90}
                                    onClick={this.goBack}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div>
                                            <div className="card p-20">
                                                <div className="row">
                                                    <div className="col-sm-10 m-b-10">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.state.title}</strong>
                                                    </div>
                                                    <div className="col-sm-2 m-b-20">
                                                        {
                                                        Storage.get('user').data.level !== 'client' &&
                                                        <Link
                                                        to={`/news/edit/${this.state.id}`}>
                                                            <button
                                                            className="btn btn-icademy-primary float-right"
                                                            style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                                <i className="fa fa-edit"></i>
                                                                Edit
                                                            </button>
                                                        </Link>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-field-top-label" style={{fontSize:12}}>
                                                        Posted on {this.state.created_at}
                                                    </div>
                                                </div>
                                                <div className="form-section no-border">
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <img src={this.state.imagePreview} style={{maxHeight:300}} />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="html-content">
                                                            <div dangerouslySetInnerHTML={{__html: this.state.content}}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default ViewNews;
