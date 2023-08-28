
import React, {useEffect, useState} from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getGroupList } from '../../../../camunda_redux/redux/action'
import {connect} from "react-redux";

let hobbies = [];

let MultipleComplete = (props) => {
    const { onChange } = props.input;
    const [grpData,setGrpData] = useState([]);

    const whenInputValueChange = async (val) =>
    {
        if(val.length > 2) {
            let formData = new FormData();
            formData.append('sau',val);
            await props.getGroupList(formData).then((resp) => {
                console.log(resp);
                let tmpArray = [];
                for (var i = 0; i < resp.data.length; i++) {
                    tmpArray.push(resp.data[i]);
                }
                setGrpData(tmpArray);
            });
        }
    };

    return (
        <div>
            <Autocomplete
                freeSolo
                multiple  //-- we dont need multiple for current scenario
                limitTags={2}
                value={props.input.value || []}
                id="multiple-limit-tags"
                options={grpData}
                onChange={(e, newValue) => {
                    onChange(newValue);

                }}
                onInputChange={(event, newInputValue) => whenInputValueChange(newInputValue)}
                getOptionLabel={option => option.sauDisplayName}
                getOptionSelected={(option, value) => option.sauDisplayName === value.sauDisplayName}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Sections"
                        fullWidth
                    />
                )}
            />
        </div>
    );
};
const mapStateToProps = (state) => {

    return { props: state.props };
}

MultipleComplete = connect(mapStateToProps,{getGroupList})(MultipleComplete)

export default MultipleComplete;
