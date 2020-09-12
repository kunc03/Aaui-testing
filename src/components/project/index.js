import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';

import ProjekNew from '../Home_new/projek';

class Project extends Component {

  render() {
    return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                  <Link to="/" className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                    ></img>
                  </Link>
                    <div className="row">
                      <div className="col-xl-12">
                          <div className="row">
          
                          <Card className="col-sm-12">
                          <Card.Body>
                              <ProjekNew />
                          </Card.Body>
                        </Card>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default Project;
