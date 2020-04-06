import React from "react";
import ReactDOM from "react-dom";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";

import API, { API_SERVER, API_SOCKET } from "../../../repository/api";
import Storage from '../../../repository/storage';

import io from 'socket.io-client';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
 // console.log("connect");
});

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: API_SERVER // Or you local Server Node V1 installation.
};

export default class FilePicker extends React.Component {

  state = {
    user: Storage.get('user').data.email,
    files: []
  }

  componentDidMount() {
    this.fetchSocket();
  }

  fetchSocket() {
    socket.on("broadcast", data => {
      this.setState({ files: [...this.state.files, data] })
    });
  }

  onClickSendFile = e => {
    e.preventDefault();
    socket.emit('send', {
      from: this.state.user,
      room: 35,
      message: 'file.txt'
    })
  }

  render() {

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <div style={{ height: "600px" }}>
                        <button onClick={this.onClickSendFile} className="btn btn-sm btn-ideku">Send File</button>
                        <ul>
                        {
                          this.state.files.map((item, i) => (
                            <li><b>{item.from}</b><br/>{item.message}</li>
                          ))
                        }
                        </ul>
                        
                        <FileManager>
                          <FileNavigator
                            id="filemanager-1"
                            api={connectorNodeV1.api}
                            apiOptions={apiOptions}
                            // capabilities={connectorNodeV1.capabilities}
                            capabilities={(apiOptions, actions) => [
                              ...connectorNodeV1.capabilities(
                                apiOptions,
                                actions
                              ),
                              {
                                id: "custom-button",
                                icon: {
                                  svg: '<svg viewBox="0 0 120 120" version="1.1"><circle cx="60" cy="60" r="50"></circle></svg>'
                                },
                                label: "Custom Button",
                                shouldBeAvailable: () => true,
                                availableInContexts: ["toolbar"],
                                handler: (e) => {
                                  alert('Custom Click')
                                }
                              }
                            ]}
                            listViewLayout={connectorNodeV1.listViewLayout}
                            viewLayoutOptions={
                              connectorNodeV1.viewLayoutOptions
                            }
                            onResourceItemRightClick={({
                              event,
                              number,
                              rowData
                            }) => 
                              console.log(
                                "onResourceItemRightClick",
                                event,
                                number,
                                rowData.name
                              )
                            }
                          />
                        </FileManager>
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
