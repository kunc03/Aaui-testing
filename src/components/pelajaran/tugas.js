import React from 'react';
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Ujian extends React.Component {

  state = {
  };

  render() {

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header header-kartu">
              Ujian
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Ujian;
