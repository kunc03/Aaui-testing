import React, { Component } from 'react';

import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {  dataUser,  dataPie,dataBar  } from '../../modul/data';
import DataUser from './dataUser';

class AllChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,

      companyName: '',
      branchName: '',
      groupName: '',
      chartData: '',
      classRooms: [],

    };

  }


  render() {


    return (
    
        <div >

            <div className="row">
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Absensi</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                    <Pie
                    data={dataPie}
                    height={320}
                    options={{ maintainAspectRatio: false }}
                    />
                </div>
                </div>
            </div>
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Lokasi</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                    <Bar 
                    data={dataUser}
                    height={320}
                    options={{ maintainAspectRatio: false }}
                    />
                </div>
                </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Usia</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                    <Bar 
                    data={dataUser}
                    height={320}
                    options={{ maintainAspectRatio: false }}
                    />
                </div>
                </div>
            </div>
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Grup / Grade</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                    <Pie
                    data={dataPie}
                    height={320}
                    options={{ maintainAspectRatio: false }}
                    />
                </div>
                </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Grup / Grade Dengan User Ter-Aktif</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                        <Doughnut data={dataBar} />

                </div>
                </div>
            </div>
            <div className="col-md-12 col-xl-6">
                <div className="card" style={{ padding: 10 }}>
                <h4 className="p-10">Data User</h4>
                <div
                    className="chart-container"
                    style={{ position: 'relative' }}
                >
                    <DataUser/>
                </div>
                </div>
            </div>
            </div>

        </div>
           
    );
  }
}

export default AllChart;
