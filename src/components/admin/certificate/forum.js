import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import Moment from 'react-moment';
import { _postLIstAllForum } from '../../forum/_forum';

export default class Forum extends Component {
  state = {
    forumlist: [],
    findForumInput: '',
  };

  findForum = (e) => {
    e.preventDefault();
    this.setState({ findForumInput: e.target.value });
  };

  componentDidMount() {
    _postLIstAllForum.bind(this)();
  }

  render() {
    let { forumlist, findForumInput } = this.state;

    if (findForumInput !== '') {
      forumlist = forumlist.filter((x) =>
        JSON.stringify(Object.values(x))
          .replace(/[^\w ]/g, '')
          .match(new RegExp(findForumInput, 'gmi'))
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12 col-xl-12" style={{ marginBottom: '10px' }}>
            <InputGroup className="mb-3" style={{ background: '#FFF' }}>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa fa-search"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ background: '#FFF' }}
                onChange={this.findForum}
                placeholder="Forum"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <InputGroup.Append style={{ cursor: 'pointer' }}>
                <InputGroup.Text id="basic-addon2">Search</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>

        {this.ForumList(forumlist)}
      </div>
    );
  }

  ForumList = (lists) => {
    if (lists.length !== 0) {
      return (
        <div>
          {lists.map((item, i) => (
            <Card style={{ marginBottom: '10px' }} key={i}>
              <Link
                to={{
                  pathname: '/certificate-create',
                  params: {
                    type_activity: 2,
                    activity: item.forum_id,
                    title: item.title,
                  },
                }}
                style={{ color: 'rgba(109,114,120,0.8)' }}
              >
                <Card.Body style={{ padding: '16px' }}>
                  <div className="forum-media">
                    <div
                      className="responsive-image-forum img-fluid mr-3 forum-gambar"
                      style={{
                        backgroundImage: `url(${
                          !item.cover
                            ? `/assets/images/component/p5.jpg`
                            : item.cover
                        })`,
                      }}
                    ></div>
                  </div>

                  <div className="forum-body">
                    <h3 className="f-16 f-w-800" style={{ marginBottom: '0' }}>
                      {item.title}
                    </h3>
                    <span className="f-12" style={{ marginBottom: '3px' }}>
                      {item.tags} -{' '}
                      <Moment format="DD/MM/YYYY">{item.created_at}</Moment>
                    </span>

                    <p style={{ margin: '5px 0' }} className="f-13">
                      {item.body}
                    </p>
                  </div>

                  <div className="forum-action">
                    {item.bookmark !== null ? (
                      <Link
                        to="#"
                        // onClick={this.deleteStar.bind(
                        //   this,
                        //   item.forum_id,
                        //   this.state.user_id
                        // )}
                      >
                        <i className="fa fa-star"></i>
                      </Link>
                    ) : (
                      <Link to="#" onClick={() => {}} style={{ color: 'gray' }}>
                        <i className="fa fa-star"></i>
                      </Link>
                    )}

                    <Link to="#" style={{ marginLeft: '10px' }}>
                      <i className="fa fa-comments"></i> &nbsp; {item.komentar}{' '}
                      Komentar
                    </Link>
                  </div>
                </Card.Body>
              </Link>
            </Card>
          ))}
        </div>
      );
    } else {
      return this.state.findForumInput ? (
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">
                Tidak ditemukan &quot;{this.state.findForumInput}&quot;
              </h3>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">Memuat halaman...</h3>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };
}
