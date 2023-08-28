import { Button, Checkbox, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import React, {useEffect} from 'react';
import {Field, reduxForm} from 'redux-form';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {connect} from "react-redux";
import {loadClassificationData,loadTypesData} from "../../../../../../camunda_redux/redux/action";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        fontSize: 12,
    },
    classificationControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        fontSize: 12,
    },
    financialYearControl: {
        margin: theme.spacing(1),
        minWidth: 180,
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
        minWidth: 250,
        fontSize: 12
    },
}));

const initialValues = {
    department: sessionStorage.getItem("department"),
}

const renderFromHelper = ({ touched, error }) => {
    if (!(touched && error)) {
        return
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>
    }
}

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
)

const renderTextArea = ({ id, input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        id = {id}
        label={label}
        multiline
        rowsMax={3}
        errortext={touched && error ? 1 : 0}
        {...input}
        {...custom}
        fullWidth="true"
        mt={0} mb={0}
    />
);

const renderTextField = ({id, input, label, meta: {touched, error }, ...custom}) => (
    <TextField
        id={id}
        label={label}
        errortext={touched && error ? 1 : 0}
        {...input}
        {...custom}
        fullWidth="true"
        margin="dense"
        mt={0} mb={0}
    />
);

const renderTextFieldHidden = ({id, input, label, meta: {touched, error }, ...custom}) => (
    <TextField
        id={id}
        label={label}
        errortext={touched && error ? 1 : 0}
        {...input}
        {...custom}
        margin="dense"
        mt={0} mb={0}
    />
);
const renderCheckbox = ({ input, label }) => (
    <div>
        <FormControlLabel
            control={
                <Checkbox
                    checked={input.value ? true : false}
                    onChange={input.onChange}
                />
            }
            label={label}
        />
    </div>
)

let SimpleForm = props => {

    const [classification1, setClassification1] = React.useState('');
    const [classificationArr, setClassificationArr] = React.useState([]);
    const [type1, setType1] = React.useState('');
    const [typeArr, setTypeArr] = React.useState([]);
    const [status1, setStatus1] = React.useState('');
    const [statusArr, setStatusArr] = React.useState([]);


    useEffect(() => {
        props.loadClassificationData().then(resp => {
            let tmpArray = []
            for (var i = 0; i < resp.data.length; i++) {
                tmpArray.push(resp.data[i]);
            }
            setClassificationArr(tmpArray);
        })
    },[]);
    // useEffect(() => {
    //     const path1 = 'http://11.0.0.119:8080';
    //     const path2 = '/office/api/getFileStatus';
    //     fetch(path1 + path2,
    //         {
    //
    //             method: 'GET',
    //             headers: {
    //                 "Accept": "*/*"
    //             }
    //
    //         }).then(response => response.json().then(resp => {
    //         let tmpArray = []
    //         for (var i = 0; i < resp.data.length; i++) {
    //             tmpArray.push(resp.data[i]);
    //         }
    //         setStatusArr(tmpArray);
    //     }));
    // },[]);

    // setTypeArr(tmpArray);
    useEffect(() => {
        props.loadTypesData().then(response => {console.log(response)
            let tmpArray = []

            for (var i = 0; i < response.data.length; i++) {
                tmpArray.push(response.data[i]);
            }
            setTypeArr(tmpArray);
        })
    },[]);

    const {handleSubmit, pristine, reset, submitting } = props;
    const classes = useStyles();

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Grid container justifyContent='center' direction='row' >
                    <Grid item xs={8}>
                        <FormControl className={classes.classificationControl} m={0}>
                            <Field
                                id="classification"
                                name="classification"
                                component={renderSelectField}
                                label="CLASSIFICATION"
                            >
                                <option value={""}>

                                </option>
                                {classificationArr.map(classification1 =>
                                    <option value={classification1}>
                                        {classification1}
                                    </option>)}
                            </Field>
                        </FormControl>
                    </Grid>
                    {/*<Grid item xs={2}></Grid>*/}
                    <Grid item xs={4}>
                        <FormControl className={classes.financialYearControl} m={0}>
                            <Field
                                id="financialYear"
                                name="financialYear"
                                component={renderSelectField}
                                label="FINANCIAL YEAR"
                            >
                                <MenuItem value={10}>2020</MenuItem>
                                <MenuItem value={10}>2019</MenuItem>
                                <MenuItem value={10}>2018</MenuItem>
                            </Field>
                        </FormControl>
                    </Grid>
                    {/*<Grid item xs={4}>*/}
                    {/*    <FormControl className={classes.formControl} >*/}
                    {/*        <Field*/}
                    {/*            id="type"*/}
                    {/*            name="type"*/}
                    {/*            component={renderSelectField}*/}
                    {/*            label="Type"*/}
                    {/*        >*/}
                    {/*            <option value={""}>*/}

                    {/*            </option>*/}
                    {/*            {typeArr.map(type1 =>*/}
                    {/*                <option value={type1}>*/}
                    {/*                    {type1}*/}
                    {/*                </option>)}*/}
                    {/*        </Field>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12}>
                        <FormControl className={classes.textFiled} m={0}>
                            <Field id ="subject" name="subject" component={renderTextArea} label="SUBJECT"/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="department" name="department" component={renderTextField} label="SECTION" disabled />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="mainHead" name="mainHead" component={renderTextField} label="MAIN HEAD" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="section" name="section" component={renderTextField} label="SUB SECTION" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="subHead" name="subHead" component={renderTextField} label="SUB HEAD" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field
                                id="blockNo"
                                name="blockNo"
                                component={renderSelectField}
                                label="BLOCK NO"
                            >
                                <MenuItem value={10}>1200-1205</MenuItem>
                                <MenuItem value={10}>1300-1305</MenuItem>
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="volume" name="volume" component={renderTextField} label="VOLUME" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="caseNo" name="caseNo" component={renderTextField} label="CASE NO" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>

                        <FormControl className={classes.formControl} m={0}>
                            <Field id="oldFileRef" name="oldFileRef" component={renderTextField} label="OLD FILE REFERENCE" />
                        </FormControl>
                    </Grid>
                    {/*<Grid item xs={4}>*/}
                    {/*    <FormControl className={classes.formControl}>*/}
                    {/*        <Field id="policyFile" name="policyFile" component={renderCheckbox} label={'Policy File'}/>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="custodian" name="custodian" component={renderTextField} label="CUSTODIAN" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="connectedFiles" name="connectedFiles" component={renderTextField} label="CONNECTED FILES" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} style={{ paddingTop: "20px", marginBottom: "5px" }}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="userName" name="userName" component={'input'} defaultValue="" type={'hidden'} style={{ height: "0px" }} />
                        </FormControl>
                        <Button id="initiate_sample_submit" autoFocus color="primary" variant="outlined" type="submit" disabled={pristine || submitting }>
                            Submit
                        </Button>
                        <Button id="initiate_sample_reset" type="button" color="primary" variant="outlined" onClick={reset} style={{marginLeft: "10px"}}>
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

SimpleForm = connect(mapStateToProps,
    {loadClassificationData,loadTypesData}
)(SimpleForm)


export default reduxForm({
    form: 'simple', // a unique identifier for this form
    initialValues
})(SimpleForm);
