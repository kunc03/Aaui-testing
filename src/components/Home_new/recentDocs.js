import React, { Component } from "react";
import moment from 'moment-timezone';
import DataTable from 'react-data-table-component';

class ListToDoNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
  }


  render() {
    const lists = this.props.lists;

    const columns = [
      {
        name: 'Files',
        selector: 'filename',
        cell: row =>
          <a href={row.url} target="_blank" className="substring" style={{ width: 300 }}>
            <img src={
              row.type === 'png' || row.type === 'pdf' || row.type === 'doc' || row.type === 'docx' || row.type === 'ppt' || row.type === 'pptx' || row.type === 'rar' || row.type === 'zip' || row.type === 'jpg' || row.type === 'csv'
                ? `assets/images/files/${row.type}.svg`
                : 'assets/images/files/file.svg'
            } width="32" /> &nbsp;{row.filename}</a>,
      },
      {
        name: 'Folder',
        selector: 'name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Date',
        selector: 'date',
        sortable: true,
        cell: row => <div>{moment.tz(row.date, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm')}</div>,
        center: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
    ]
    return (
      <div className="col-sm-12">

        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              No Documents
            </div>
            :
            <DataTable
              style={{ marginTop: 20 }} columns={columns} data={lists} striped={false} noHeader={true}
            />
        }
      </div>
    );
  }
}

export default ListToDoNew;
