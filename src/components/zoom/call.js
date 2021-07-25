import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import API, { API_SERVER } from '../../repository/api';

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
              
                <h4>Zoom</h4>
                <p>{loading ? 'Syncing...' : 'Success Sync.'}</p>

                {loading ? null : <Link to="/" className="btn btn-primary">Back to Home</Link> }
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}