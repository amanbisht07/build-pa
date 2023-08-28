import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from "react-redux";
import { loadFileTypesData, loadPFileData } from "../../../../../../camunda_redux/redux/action";
import FormHelperText from '@material-ui/core/FormHelperText'
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '100%',
        fontSize: 12,
    },
    classificationControl: {
        margin: theme.spacing(1),
        minWidth: '100%',
        fontSize: 12,
    },
    textFiled: {
        margin: theme.spacing(1),
        // minWidth: 500,
        minWidth: 540,
        fontSize: 12,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        minWidth: '100%',
        fontSize: 12
    },
}));

const initialValues = {};

const validate = values => {
    const errors = {};
    const requiredFields = [
        'type',
        'subject',
        'pfileName'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This Field is Required'
        }
    })
    return errors
}

const renderFromHelper = ({ touched, error }) => {
    if (!(touched && error)) {
        return
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>
    }
};

const renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
}) => (
    <FormControl error={touched && error}>
        <InputLabel htmlFor="color-native-simple">{label}</InputLabel>
        <Select
            native
            {...input}
            {...custom}
            inputProps={{
                name: input.name,
                id: 'color-native-simple'
            }}
            mt={0} mb={0}
        >
            {children}
        </Select>
        {renderFromHelper({ touched, error })}
    </FormControl>
);

const renderTextField = ({ id, input, label, meta: { touched, invalid, error }, ...custom }) => (
    <FormControl error={touched && error}>
        <TextField
            id={id}
            label={label}
            errortext={touched && error ? 1 : 0}
            {...input}
            {...custom}
            fullWidth
            margin="dense"
            mt={0} mb={0}
        />
        {renderFromHelper({ touched, error })}
    </FormControl>
);

let PersonalApplicationForm = (props) => {

    const [pFileArr, setPFileArr] = React.useState([]);
    const username = localStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    useEffect(() => {
        props.loadPFileData(username, role).then(response => {
            console.log(response)
            let tmpArray = [];

            for (var i = 0; i < response.data.length; i++) {
                tmpArray.push(response.data[i].pfileName);
            }
            setPFileArr(tmpArray);
        })
    }, []);

    const { handleSubmit, pristine, reset, submitting } = props;
    const classes = useStyles();

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Grid container justifyContent='center' direction='row' >
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="subject" name="subject" component={renderTextField} label="Subject" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.classificationControl} m={0}>
                            <Field
                                id="pfileName"
                                name="pfileName"
                                component={renderSelectField}
                                label="P-File"
                            >
                                <option key={""} value={""}>

                                </option>
                                {pFileArr.map(type =>
                                    <option key={type} value={type}>
                                        {type}
                                    </option>)}
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: "20px", marginBottom: "5px", textAlign: "end" }}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="roleName" name="roleName" component={'input'} type={'hidden'} style={{ height: "0px" }} />
                        </FormControl>
                        <Button id="initiate_PA_submit" autoFocus color="primary" variant="outlined" type="submit" disabled={pristine || submitting} endIcon={<DoneIcon />}>
                            Submit
                        </Button>
                        <Button id="initiate_PA_reset" type="button" color="primary" variant="outlined" onClick={reset} style={{ marginLeft: "10px" }} endIcon={<UndoIcon />}>
                            Reset
                        </Button>
                    </Grid>

                </Grid>

            </div>
        </form>
    );
}

const mapStateToProps = (state) => {

    return { props: state.props };
}

PersonalApplicationForm = connect(mapStateToProps,
    { loadFileTypesData, loadPFileData }
)(PersonalApplicationForm)


export default reduxForm({
    form: 'personalApplication', // a unique identifier for this form
    initialValues,
    validate,
})(PersonalApplicationForm);
