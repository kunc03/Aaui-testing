import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';
import { Modal } from 'react-bootstrap';
class ClassBantuan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tags:'All',
        data: [],
        modalVid: false,
        title:'',
        url:'',
        type:''
    };
  }

  componentDidMount() {
      this.getTutorial();
  }

  closeModalVid = e => {
    this.setState({ modalVid: false, url: '', title: '', type: '' })
  }
  
  onClickVid(title, url, type){
    this.setState({modalVid: true, url: url, title: title, type: type})
  }

  getTutorial() {
    API.get(`${API_SERVER}v3/tutorial`).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data.result
        });
      }
    })
  }

filterTags(val){
    this.setState({tags: val});
}
  render() {    
    let {tags, data} = this.state;
    if (tags !== "All") {
      data = data.filter(x =>
        x.tags === tags
      )
    }
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">

              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-block">
                          {/* <h3 className="f-w-bold f-18 fc-blue mb-4">BANTUAN</h3> */}
                          <div className="row m-b-100">

                            <div className="col-sm-12">
                                <h3 className="f-w-bold f-18 fc-blue mb-4">TUTORIALS</h3>
                                <div className="row col-sm-12" style={{marginBottom:20}}>
                                    <div className={`tutorial-filter-items ${this.state.tags === 'All' && 'active'}`} onClick={this.filterTags.bind(this, 'All')}>All</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Project' && 'active'}`} onClick={this.filterTags.bind(this, 'Project')}>Project</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Meeting' && 'active'}`} onClick={this.filterTags.bind(this, 'Meeting')}>Meeting</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Webinar' && 'active'}`} onClick={this.filterTags.bind(this, 'Webinar')}>Webinar</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Learning' && 'active'}`} onClick={this.filterTags.bind(this, 'Learning')}>Learning</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Training' && 'active'}`} onClick={this.filterTags.bind(this, 'Training')}>Training</div>
                                    <div  className={`tutorial-filter-items ${this.state.tags === 'Others' && 'active'}`} onClick={this.filterTags.bind(this, 'Others')}>Others</div>
                                </div>
                                <div className="row">
                                    {
                                        data.map((item)=>
                                        <div className="items-tutorial col-sm-3" onClick={this.onClickVid.bind(this, item.title, item.url, item.type)}>
                                            <div className="tutorial-thumbnail">
                                                <img src={item.thumbnail} />
                                                <div className="tutorial-time">
                                                    {
                                                    item.type === 'video' ? item.time
                                                    : item.type === 'ppt' ? <i className="fa fa-file-powerpoint" style={{fontSize:'18px'}}></i>
                                                    : <i className="fa fa-file-pdf" style={{fontSize:'18px'}}></i>
                                                    }
                                                </div>
                                            </div>
                                            <div className="tutorial-title">
                                                {item.title}
                                            </div>
                                        </div>
                                        )
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
        </div>
          <Modal show={this.state.modalVid} onHide={this.closeModalVid} dialogClassName="modal-lg" centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                <h5>{this.state.title}</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    this.state.type === 'video' ?
                    <iframe src={this.state.url} height="431" allow="autoplay" style={{border:'none', width: '100%'}}></iframe>
                    : this.state.type === 'ppt' ?
                    <iframe src={this.state.url} frameborder="0" height="464" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style={{border:'none', width: '100%'}}></iframe>
                    :
                    <iframe src={this.state.url} height="431" allow="autoplay" style={{border:'none', width: '100%'}}></iframe>
                }
            </Modal.Body>
          </Modal>
      </div>
    );
  }
}

export default ClassBantuan;
