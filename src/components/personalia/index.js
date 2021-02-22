import React from 'react';

import Murid from './murid';
import Guru from './guru';

class Personalia extends React.Component {

  state = {
    tab: 'murid'
    // tab: 'guru'
  }

  selectTab = e => {
    e.preventDefault();
    let tab = e.target.getAttribute('data-id');
    this.setState({ tab: tab });
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <button onClick={this.selectTab} data-id='murid' className="btn btn-v2 btn-primary" style={{marginBottom: '0px'}}>Data Murid</button>
              <button onClick={this.selectTab} data-id='guru' className="btn btn-v2 btn-primary ml-2" style={{marginBottom: '0px'}}>Data Guru</button>
            </div>
          </div>
        </div>

        {
          this.state.tab === 'murid' && <Murid />
        }

        {
          this.state.tab === 'guru' && <Guru />
        }

      </div>
    );
  }

}

export default Personalia;
