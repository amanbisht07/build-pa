import React, { Component } from "react";
import { Button, Typography } from "@material-ui/core";

class NotFound extends Component {
  state = {};
  render() {
    return (
      <div className="flex flex-center flex-middle w-100 h-100vh">
        <div className="flex flex-column flex-center flex-middle" >
          <img className="mb-32" src={process.env.PUBLIC_URL +`/assets/images/illustrations/404-error.png`} alt="" style={{maxWidth: '400px'}} />
          <Typography variant='h6'>Services are down, please make sure services are up & running.</Typography>
          <Typography variant='h6'>If problem still persists please contact administrator</Typography>
          <Button
            id="RTI_back_to_dashboard"
            className="capitalize"
            variant="contained"
            color="primary"
            onClick={() => this.props.history.push("/eoffice")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
}

export default NotFound;
