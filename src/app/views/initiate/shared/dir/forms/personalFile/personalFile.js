import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from "react-redux";
import { loadFileTypesData } from "../../../../../../camunda_redux/redux/action";
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
        'pFileName',
        'subject'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This Filed is Required'
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

const renderTextField = ({ id, input, label, meta: { touched, error }, ...custom }) => (
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

let PersonalFileForm = props => {

    const [type1, setType1] = React.useState('');
    const [typeArr, setTypeArr] = React.useState([]);

    useEffect(() => {
        props.loadFileTypesData().then(response => {
            let tmpArray = []
            if (response.data !== undefined && response.data !== null) {
                for (var i = 0; i < response.data.length; i++) {
                    tmpArray.push(response.data[i].type);
                }
            }
            setTypeArr(tmpArray);
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
                    <Grid item xs={12} style={{ paddingTop: "20px", marginBottom: "5px", textAlign: 'right' }}>
                        <FormControl className={classes.formControl} m={0}>
                            <Field id="userName" name="userName" component={'input'} type={'hidden'} style={{ height: "0px" }} />
                            <Field id="roleName" name="roleName" component={'input'} type={'hidden'} style={{ height: "0px" }} />
                        </FormControl>
                        <Button id="initiate_PF_submit" autoFocus color="primary" variant="outlined" type="submit" disabled={pristine || submitting} endIcon={<DoneIcon />}>
                            Submit
                        </Button>
                        <Button id="initiate_PF_reset" type="button" color="primary" variant="outlined" endIcon={<UndoIcon />} onClick={reset} style={{ marginLeft: "10px" }}>
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

PersonalFileForm = connect(mapStateToProps,
    { loadFileTypesData }
)(PersonalFileForm)


export default reduxForm({
    form: 'personalFile', // a unique identifier for this form
    initialValues,
    validate
})(PersonalFileForm);
