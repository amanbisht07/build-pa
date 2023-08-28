import { Button, Checkbox, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField ,Input,Chip } from '@material-ui/core';
import React, {useEffect} from 'react';
import {Field, reduxForm} from 'redux-form';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import {connect} from "react-redux";
import {
    loadClassificationData,
    loadGroupsData,
    loadRolesData,
    loadTypesData,
    getGroupList
} from '../../../../../../camunda_redux/redux/action';
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Autocomplete from '@material-ui/lab/Autocomplete'
import MultipleComplete from "../../autocompleteForm";
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '95%',
    },
    textFiled: {
        margin: theme.spacing(1),
        minWidth: '95%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        minWidth: '95%',
    },
    checkboxMargin: {
      marginRight: '5%'
    },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const renderFromHelper = ({ touched, error }) => {
    if (!(touched && error)) {
        return
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>
    }
}

const radioButton = ({ input }) => (
    <FormControl>
        <RadioGroup {...input }>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
    </FormControl>
)

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
            {...input}
            {...custom}
            multiple
            inputProps={{
                name: input.name,
                id: 'color-native-simple'
            }}
            MenuProps={{
                getContentAnchorEl: () => null,
            }}
        >
            {[children]}
        </Select>
        {renderFromHelper({ touched, error })}
    </FormControl>
);


const renderAutoComplete = ({
                              input, hobbies,
                              meta: { touched, error, submitFailed }
                          }) => {
    const { onChange, onInputChange, ...rest } = input;
    return (
        <div>
            <Autocomplete
                freeSolo
                multiple
                limitTags={2}
                value={input.value || []}
                options={hobbies}
                onChange={(e, newValue) => {
                    onChange(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    return newInputValue;
                }}
                getOptionLabel={option => option.sauDisplayName}
                getOptionSelected={(option, value) => option.sauDisplayName === value.sauDisplayName}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Choose Multiple Hobbies"
                        fullWidth
                    />
                )}
            />
        </div>
    );
};


const renderTextField = ({id, input, label, meta: {touched, error }, ...custom}) => (
    <TextField
        id={id}
        label={label}
        variant="outlined"
        errortext={touched && error ? 1 : 0}
        {...input}
        {...custom}
        fullWidth="true"
    />
);

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
        margin="dense"
    />
);

const renderTextFieldHidden = ({id, input, label, meta: {touched, error }, ...custom}) => (
    <TextField
        id={id}
        label={label}
        variant="outlined"
        errortext={touched && error ? 1 : 0}
        {...input}
        {...custom}
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
);

let SimpleForm = props => {

    const [role1, setRole1] = React.useState('');
    const [grp1, setGrp1] = React.useState('');
    const [grpArr, setGrpArr] = React.useState([]);


    // useEffect(() => {
    //     props.loadGroupsData().then(resp => {
    //         let tmpArray = []
    //         for (var i = 0; i < resp.data.length; i++) {
    //             tmpArray.push(resp.data[i]);
    //         }
    //         setGrpArr(tmpArray);
    //     })
    // },[]);

    const radioButton = ({ input, ...rest }) => (
        <RadioGroup {...input} {...rest} value={input.value}
                    onChange={(event, value) => input.onChange(value)}/>
    )
    const {handleSubmit, pristine, reset, submitting } = props;
    const classes = useStyles();

    return (
        <form onSubmit={handleSubmit}>
            <div>

                <Grid container justifyContent='center' direction='row' >
                    {/*<Grid item xs={12} direction='row'>*/}
                    {/*    <FormControl className={classes.formControl} style={{display: 'block'}}>*/}

                    {/*        <label className={classes.checkboxMargin}>Priority :</label>*/}
                    {/*        <label className={classes.checkboxMargin}><Field name="priority" component="input" type="radio" value="normal"/>{''} Normal</label>*/}
                    {/*        <label className={classes.checkboxMargin}><Field name="priority" component="input" type="radio" value="high"/>{''} High</label>*/}
                    {/*        <label className={classes.checkboxMargin}><Field name="priority" component="input" type="radio" value="urgent"/>{''} Urgent</label>*/}
                    {/*        <label className={classes.checkboxMargin}><Field name="priority" component="input" type="radio" value="critical"/>{''} Critical</label>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    {/*<div style={{    width: '100%',*/}
                    {/*    backgroundColor: '#c4e2fd',*/}
                    {/*    padding: '2px 2px 6px 8px',*/}
                    {/*    borderRadius: '5px'}}>*/}
                    {/*    <Grid item xs={12}>*/}
                    {/*        <Typography variant="overline" display="block" gutterBottom>*/}
                    {/*            Internal Routing*/}
                    {/*        </Typography>*/}
                    {/*        <FormControl className={classes.formControl}>*/}
                    {/*            <Field*/}
                    {/*                id="roles"*/}
                    {/*                name="roles"*/}
                    {/*                component={renderSelectField}*/}
                    {/*                value={[]}*/}
                    {/*                label="Role"*/}
                    {/*                format={value => Array.isArray(value) ? value : []}*/}
                    {/*            >*/}
                    {/*                <MenuItem value={''}>*/}

                    {/*                </MenuItem>*/}
                    {/*                {roleArr.map(role1 =>*/}
                    {/*                    <MenuItem value={role1}>*/}
                    {/*                        {role1}*/}
                    {/*                    </MenuItem>)}*/}
                    {/*            </Field>*/}
                    {/*        </FormControl>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={12}>*/}
                    {/*        <FormControl className={classes.textFiled}>*/}
                    {/*            <Field id ="comment" name="comment" component={renderTextArea} label="Comments"/>*/}
                    {/*        </FormControl>*/}
                    {/*    </Grid>*/}
                    {/*</div>*/}
                    <Grid item xs={12}>
                        <Typography variant="overline" display="block" gutterBottom>
                            Please select your HRM/Controlling Section
                        </Typography>
                        <FormControl className={classes.formControl}>

                            <Field
                                name="groups"
                                component={MultipleComplete}
                                label="Sections"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <Field id="currentUser" name="currentUser" component="input" type='hidden' label="" style={{ height: "0px" }} />
                            <Field id="roleName" name="roleName" component="input" type='hidden' label="" style={{ height: "0px" }} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <Field id="status" name="status" value="fileSentValue" component="input" type='hidden' label="" style={{ height: "0px" }} />
                        </FormControl>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid item xs={12} style={{textAlign: 'right'}}>
                        <Button id="initiate_sendFile_submit" autoFocus color="primary" type="submit" variant="outlined" disabled={pristine || submitting} endIcon={<DoneIcon />}>
                            Submit
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
    {loadGroupsData,loadRolesData,getGroupList}
)(SimpleForm)

export default (reduxForm({
    form: 'simple' // a unique identifier for this form
})(SimpleForm));
