import React from "react";
import ReactDOM from "react-dom";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: `http://localhost:4000` // Or you local Server Node V1 installation.
};

export default class FilePicker extends React.Component {

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
