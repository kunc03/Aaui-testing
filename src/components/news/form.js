import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';

class FormNews extends Component {
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
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/news');
    }
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

  save = (e) =>{
    this.setState({isSaving: true})
    e.preventDefault();
    if (!this.state.title.length || !this.state.content.length){
        toast.warning('Some field is required, please check your data.')
        this.setState({isSaving: false})
    }
    else{
        if (this.state.id){
            let form = {
                title: this.state.title,
                content: this.state.content
            }
            API.put(`${API_SERVER}v2/news/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit news')
                    this.setState({isSaving: false})
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/news/image/${this.state.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('News edited but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                            }
                            else{
                                toast.success('News edited')
                                this.setState({edited: false, isSaving: false})
                                this.props.history.push(`/news`)
                            }
                        })
                    }
                    else{
                        toast.success('News edited')
                        this.setState({edited: false, isSaving: false})
                        this.props.history.push(`/news`)
                    }
                }
            })
        }
        else{
            let form = {
                company_id: this.state.companyId,
                title: this.state.title,
                content: this.state.content,
                created_by: this.state.userId
            }
            API.post(`${API_SERVER}v2/news`, form).then(res => {
                if (res.data.error){
                    toast.error('Error saving news')
                    this.setState({isSaving: false})
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/news/image/${res.data.result.insertId}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('News saved but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                            }
                            else{
                                toast.success('News saved')
                                this.setState({edited: false, isSaving: false})
                                this.props.history.push(`/news`)
                            }
                        })
                    }
                    else{
                        toast.success('News saved')
                        this.setState({edited: false, isSaving: false})
                        this.props.history.push(`/news`)
                    }
                }
            })
        }
    }
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
                                                    <div className="col-sm-10 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create'} News</strong>
                                                    </div>
                                                    <div className="col-sm-2 m-b-20">
                                                        {
                                                        this.props.disabledForm &&
                                                        <button
                                                        onClick={this.props.goEdit}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                            <i className="fa fa-edit"></i>
                                                            Edit
                                                        </button>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-section no-border">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>News / Announcements</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Thumbnail</label>
                                                            <label for="image" style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                                                                <img src={this.state.imagePreview} height="54.8px" />
                                                            </label>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="title">Title<required>*</required></label>
                                                            <input type="text" name="title" size="50" id="name" placeholder="XXXXX XXXXX XXXXX" value={this.state.title} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label" style={{width:'80%'}}>
                                                                    <label for="content">Content<required>*</required></label>
                                                                    <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                    {
                                                                        this.state.content !== 'Loading...' ?
                                                                        <Editor
                                                                            name="content"
                                                                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                                                            initialValue={this.state.content}
                                                                            value={this.state.content}
                                                                            init={{
                                                                            height: 400,
                                                                            // menubar: false,
                                                                            convert_urls: false,
                                                                            image_class_list: [
                                                                                {title: 'None', value: ''},
                                                                                {title: 'Responsive', value: 'img-responsive'},
                                                                                {title: 'Thumbnail', value: 'img-responsive img-thumbnail'}
                                                                            ],
                                                                            file_browser_callback_types: 'image',
                                                                            file_picker_callback: function (callback, value, meta) {
                                                                                if (meta.filetype == 'image') {
                                                                                var input = document.getElementById(`myFile`);
                                                                                input.click();
                                                                                input.onchange = function () {
        
                                                                                    var dataForm = new FormData();
                                                                                    dataForm.append('file', this.files[0]);
        
                                                                                    window.$.ajax({
                                                                                    url: `${API_SERVER}v2/media/upload`,
                                                                                    type: 'POST',
                                                                                    data: dataForm,
                                                                                    processData: false,
                                                                                    contentType: false,
                                                                                    success: (data)=>{
                                                                                        callback(data.result.url);
                                                                                        this.value = '';
                                                                                    }
                                                                                    })
        
                                                                                };
                                                                                }
                                                                            },
                                                                            plugins: [
                                                                                "advlist autolink lists link image charmap print preview anchor",
                                                                                "searchreplace visualblocks code fullscreen",
                                                                                "insertdatetime media table paste code help wordcount",
                                                                                "autoresize"
                                                                            ],
                                                                            toolbar:
                                                                                // eslint-disable-next-line no-multi-str
                                                                                "undo redo | bold italic backcolor | \
                                                                            alignleft aligncenter alignright alignjustify | image | \
                                                                                bullist numlist outdent indent | removeformat | help"
                                                                            }}
                                                                            onEditorChange={e => this.handleContent(e)}
                                                                        />
                                                                        :null
                                                                    }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{justifyContent:'flex-end'}}>
                                                    {
                                                    !this.props.disabledForm &&
                                                    <button
                                                    disabled={this.state.isSaving}
                                                    onClick={this.save}
                                                    className="btn btn-icademy-primary float-right"
                                                    style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                        <i className="fa fa-save"></i>
                                                        {this.state.isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                    }
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

export default FormNews;
