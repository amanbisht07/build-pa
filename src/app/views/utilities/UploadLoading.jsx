import React from "react";
import ReactDOM from 'react-dom';
import "./index.css";

const UploadLoading = (props) => {
  return ReactDOM.createPortal(
    <>
      <div className="bouncing-loader" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#3e3d3d87",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height:"100vh",
            zIndex:10000,
            marginTop:"0px"
      }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  , document.getElementById('uploadLoad'))
};

export default UploadLoading;
