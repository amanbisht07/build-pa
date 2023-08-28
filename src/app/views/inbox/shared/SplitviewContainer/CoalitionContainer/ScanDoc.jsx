import React from "react";
import "../../../therme-source/material-ui/loading.css";
import { Divider, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import ScanDocument from "../../ScanDocument";



const ScanDoc = (props) => {
    const handleUploadNoting = (values) => {
        let tempArr = notingData;
        for (let i = 0; i < values.length; i++) {
            tempArr.push(values[i]);
        }
        setNotingData(tempArr);
        let event = {
            target: {
                value: JSON.stringify(values[0]),
            },
        };
        handleChange(event);
    };

    return (
        <div className="container_scan_doc">
            <div className="card_container">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 className="files">Files</h4>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "10px",
                        }}
                    >
                        <div >
                            <ScanDocument
                                rowID={props.rowID}
                                handleUploadNoting={handleUploadNoting}
                            />
                        </div>
                        <RemoveCircleIcon style={{ cursor: "pointer", color: "#354c64", marginLeft: "10px" }} />
                    </div>
                </div>
                <Divider />
                <Typography className="typo">
                    Click on the 'Add' button to add files to your folder or simply drag
                    and drop them from your desktop into this panel.
                </Typography>
            </div>
        </div>
    );
};

export default ScanDoc;
