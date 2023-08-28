import './index.css';
import { Breadcrumb } from "../../../../matx";
import * as React from 'react';
import { SampleBase } from './sample-base';
import { FileManagerComponent, Inject, NavigationPane, DetailsView, Toolbar } from '@syncfusion/ej2-react-filemanager';
import { Container,Grid } from '@material-ui/core';
import { useTranslation } from "react-i18next";
export class FileSystem extends SampleBase {
  hostUrl = "https://ej2-aspcore-service.azurewebsites.net/";

  render() {
    
    return (
    
    <div>
      <Container>
       <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[
                { name: ("DMS"), path: "/personnel/file" },
              ]}
            />
          </Grid>
      <div className="syncfusion_control">
        <FileManagerComponent className="syncfusion_edit" ajaxSettings={{
          url: this.hostUrl + "api/FileManager/FileOperations",
          getImageUrl: this.hostUrl + "api/FileManager/GetImage",
          uploadUrl: this.hostUrl + 'api/FileManager/Upload',
          downloadUrl: this.hostUrl + 'api/FileManager/Download'
        }} view={"Details"}>
          <Inject    services={[NavigationPane, DetailsView, Toolbar]}  />
        </FileManagerComponent>
      </div>
    
      </Container>
    </div>
    );
  }
}

export default FileSystem