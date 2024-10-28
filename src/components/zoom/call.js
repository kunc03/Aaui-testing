import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import API, { API_SERVER } from '../../repository/api';
import { isMobile } from 'react-device-detect';

export default function Call(props) {

  const { search } = props.location
  const code = search.substring(6, search.length)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (code) {
      setLoading(true)
      API.post(`${API_SERVER}v3/zoom/user`, { code }).then(res => {
        if (res.status === 200) {
          setLoading(false)
        }
      })
    }
  }, [code]);

  return (
    <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
                
                <div className="auth-wrapper">
                  <div className="auth-content mb-4" style={{ display: isMobile ? 'none' : 'block' }}>
                    <div className=" b-r-15">
                      <div
                        className=" text-center"
                        style={{ padding: "50px !important" }}
                      >
                        <div className="mb-4">
                          <img
                            src="newasset/user-computer.svg"
                            style={{ width: 350 }}
                            alt=""
                          />
                        </div>
                        <h4 className="mb-0 mt-1" style={{ textTransform: 'uppercase' }}>
                          ZOOM Integration
                        </h4>
                        <p className="mb-0 mt-1">
                          We are ready to connect you with others
                        </p>
        
                      </div>
                    </div>
                  </div>
                  
                  <div className="auth-content mb-4">
                    <div className="card b-r-15">
                      <div
                        className="card-body"
                        style={{ padding: "50px !important" }}
                      >
                        <div className="row">
                          <div className="col-sm-12">
                            <p>
                              <b style={{ color: 'black' }}>
                                {
                                  loading ? 'Please wait for sync...' : 'Sync successfully.'
                                }
                              </b>
                            </p>
                                  
                            {loading ? null : <Link to="/" className="btn btn-primary">Back to Home</Link>}

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