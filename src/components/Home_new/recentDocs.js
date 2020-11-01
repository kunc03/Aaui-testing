import React, { Component } from "react";
import Moment from 'moment-timezone';


class ListToDoNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
  }


  render() {
  //  console.log(this.props, 'props evenntttt')
    const lists = this.props.lists;
    return (
      <div className="col-sm-12">
        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              Tidak ada
            </div>
          :
          <table style={{width:'100%'}}>
            <tr>
                <th>Files</th>
                <th>Folder</th>
                <th>Time</th>
            </tr>
            {lists.map((item, i) => (
                <tr style={{fontSize:10}}>
                  <td className="fc-muted f-w-300 p-t-20"><a href={item.url} target="_blank" className="substring" style={{width:300}}>
                      <img src={
                      item.type == 'png' || item.type == 'pdf' || item.type == 'doc' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg' || item.type == 'csv'
                      ? `assets/images/files/${item.type}.svg`
                      : 'assets/images/files/file.svg'
                    } width="32"/> &nbsp;{item.filename}</a></td>
                    <td>{item.name}</td>
                    <td>{Moment.tz(item.date, 'Asia/Jakarta').format('DD-MM-YYYY HH:mm')}</td>
                </tr>
            ))}
          </table>
        }
      </div>
    );
  }
}

export default ListToDoNew;
