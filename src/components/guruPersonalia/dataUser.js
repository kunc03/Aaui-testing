import React, { Component } from 'react';

import { bodyTabble, headerTabble } from '../../modul/data';
import moment from 'moment-timezone';

class DataUser extends Component {
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

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                            <td>Webinar Name</td>
                            {
                                headerTabble.map((item, i) => {
                                    return (
                                        <td align="center" width={item.width}>{item.title}</td>
                                    )
                                })
                            }
                            <td colSpan="2" align="center"> Action </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bodyTabble.length == 0 ?
                                <tr>
                                    <td className="fc-muted f-14 f-w-300 p-t-20" colspan='8'>There is no</td>
                                </tr>
                                :
                                bodyTabble.map((item, i) => {

                                    return (
                                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                                            <td className="fc-muted f-14 f-w-300 p-t-20">asd</td>
                                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">dasd}</td>
                                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">
                                                aaaa
                                </td>
                                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">asdasd</td>
                                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">asdasd</td>
                                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">asdasd</td>
                                            <td className="fc-muted f-14 f-w-300 " align="center">
                                                aaa
                                </td>
                                        </tr>
                                    )
                                })
                        }

                    </tbody>
                </table>
            </div>

        );
    }
}

export default DataUser;
