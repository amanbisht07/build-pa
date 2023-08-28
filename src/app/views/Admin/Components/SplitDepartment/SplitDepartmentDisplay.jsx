import {
    Button,
    Grid,
    IconButton,
    Paper,
    Divider,
    Tooltip,
    MenuItem,
    Typography,
} from "@material-ui/core";
import * as Yup from "yup";
import { Field, FieldArray, Form, Formik, } from "formik";
import { Select, TextField, } from "formik-material-ui";
import React, { useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from '@material-ui/icons/Done';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import './split.css'
import { getroledata, getroledatavalues, PostSplitdepartmentdta } from "app/camunda_redux/redux/action";
import { connect } from "react-redux";


const SplitDepartmentDisplay = (props) => {

    const [departmentname, setDepartmentname] = React.useState([])
    const [deptRoledata, setDeptRoledata] = React.useState([])

    let reset;

    const empty = {
        deptName: "",
        deptDisplayName: "",
        deptCoordRole: "",
        description: '',
        roles: []
    };

    const roledata = () => {
        let tempArr = []
        props.getroledata().then((response) => {
            for (let i = 0; i < response.length; i++) {
                tempArr.push(response[i].deptName + " | " + response[i].deptDisplayName);
            }
            setDepartmentname(tempArr)
        })
    }

    const handleChange1 = (e) => {
        let temparr2 = []
        let data = e.slice(0, e.indexOf(" | "))

        console.log("data values", data)

        props.getroledatavalues(data).then((resp) => {
            resp.map(item => {
                temparr2.push(item)
            })
            setDeptRoledata(temparr2)
        })
    }

    useEffect(() => {
        props.getroledatavalues()
    }, [])

    useEffect(() => {
        roledata()
    }, [])

    const initialValues = {
        departments: [empty, empty],
        department: "",
    }

    const SendSplitDeptdara = (values) => {
        props.PostSplitdepartmentdta(values)
    }

    return (
        <>
            <div style={{ display: 'flex', width: "98.5%", }} >
                <Paper
                    elevation={3} style={{ border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}` }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }} >

                        <div> <h4 className='split_department_heading' >SPLIT DEPARTMENT </h4> </div>
                        <Divider />
                        <div>
                            < Formik
                                initialValues={initialValues}
                                validationSchema={Yup.object().shape({
                                    department: Yup.string().required(),
                                    departments: Yup.array().of(
                                        Yup.object().shape({
                                            deptName: Yup.string().required("Enter Department Name"),
                                            deptDisplayName: Yup.string().required(" Enter Department Display Name"),
                                            deptCoordRole: Yup.string().required("Enter Department Cord Role"),
                                            description: Yup.string().required(" Enter Description"),
                                            roles: Yup.array().required("Plese Add Roles ")
                                        })
                                    ).test((departments) => {
                                        let sum = 0;
                                        departments?.map((item, ind) => {
                                            sum += item.roles.length
                                        })
                                        if (sum === deptRoledata.length) {
                                            // console.log("Valid")
                                            return true
                                        }
                                        else {
                                            // console.log("Invalid")
                                            return false
                                        }
                                    })
                                })}
                                onSubmit={(values) => {
                                    SendSplitDeptdara(values)
                                    reset()
                                }}
                            >
                                {({ values, handleReset, setFieldValue, errors }) => {
                                    reset = handleReset;
                                    return (
                                        <Form autoComplete="off" >
                                            <div className='form_split_department' >
                                                <Grid container spacing={2} style={{ padding: "1rem" }} >
                                                    <Grid item xs={11} style={{ padding: '1rem 0 0 1rem' }} >
                                                        <Field
                                                            size='small'
                                                            component={Select}
                                                            label='Select Department'
                                                            variant='outlined'
                                                            name='department'
                                                            values={values.department}
                                                            onChange={(event, value) => handleChange1(value.props.value)}
                                                            className='srlect_department_drop'
                                                        >

                                                            {departmentname.map((list) => <MenuItem key={list}
                                                                value={list}  >{list}</MenuItem>)}
                                                        </Field>
                                                    </Grid>
                                                    <FieldArray name="departments">
                                                        {({ push, remove }) => (
                                                            <React.Fragment>
                                                                <Grid item xs={1} className='add_field_button' >
                                                                    <IconButton
                                                                        id="attendeeDetails_close_btn"
                                                                        aria-label="Add"
                                                                        onClick={() => push(empty)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            position: "relative",
                                                                            background: "rgba(53, 76, 100, 1)",
                                                                            height: "36px",
                                                                            width: "36px"
                                                                        }}
                                                                    >
                                                                        <Tooltip title={"Add"} aria-label="Add">
                                                                            <AddIcon className='add_field_button_icon' />
                                                                        </Tooltip>
                                                                    </IconButton>
                                                                </Grid>
                                                                {values.departments.map((item, index) => {
                                                                    return (
                                                                        <Paper
                                                                            key={index}
                                                                            className='add_department_field_input'
                                                                        >

                                                                            <div className='add_department_comp'>
                                                                                <div className='add_department_field_input_child' >
                                                                                    <Field
                                                                                        name={`departments.${index}.deptName`}
                                                                                        component={TextField}
                                                                                        size="small"
                                                                                        fullWidth
                                                                                        label="Department New Name"
                                                                                        variant="outlined"
                                                                                    />
                                                                                </div>
                                                                                <div className='add_department_field_input_child'>
                                                                                    <Field
                                                                                        name={`departments[${index}].deptDisplayName`}
                                                                                        component={TextField}
                                                                                        size="small"
                                                                                        fullWidth
                                                                                        label="Department Display Name"
                                                                                        variant="outlined"
                                                                                    />

                                                                                </div>
                                                                                <div className='add_department_field_input_child'>
                                                                                    <Field
                                                                                        name={`departments[${index}].deptCoordRole`}
                                                                                        component={TextField}
                                                                                        size="small"
                                                                                        fullWidth
                                                                                        label="Department Cord Role "
                                                                                        variant="outlined"
                                                                                    />
                                                                                </div>
                                                                                <div className='add_department_field_input_child'>
                                                                                    <Field
                                                                                        name={`departments[${index}].description`}
                                                                                        component={TextField}
                                                                                        size="small"
                                                                                        fullWidth
                                                                                        label="Description"
                                                                                        variant="outlined"
                                                                                    />

                                                                                </div>
                                                                                <div className='add_department_field_input_child'>
                                                                                    <Field
                                                                                        size='small'
                                                                                        component={Select}
                                                                                        label='Add Role'
                                                                                        variant='outlined'
                                                                                        name={`departments[${index}].roles`}
                                                                                        className="select_add_field"
                                                                                        multiple={true}
                                                                                        onChange={(event) => {
                                                                                            const selectedRoles = event.target.value;
                                                                                            const selectedDept = values.departments[index];
                                                                                            const newRoles = selectedDept.roles.filter(role => selectedRoles.includes(role));
                                                                                            selectedRoles.forEach(role => {
                                                                                                if (!selectedDept.roles.includes(role)) {
                                                                                                    newRoles.push(role);
                                                                                                }
                                                                                            });
                                                                                            setFieldValue(`departments[${index}].roles`, newRoles);
                                                                                        }}
                                                                                    >
                                                                                        {deptRoledata
                                                                                            .filter(role => {
                                                                                                return !values.departments
                                                                                                    .slice(0, index)
                                                                                                    .flatMap(dept => dept.roles)
                                                                                                    .concat(values.departments.slice(index + 1).flatMap(dept => dept.roles))
                                                                                                    .includes(role);
                                                                                            })
                                                                                            .map((rolevalues) => (
                                                                                                <MenuItem key={rolevalues} value={rolevalues}>
                                                                                                    {rolevalues}
                                                                                                </MenuItem>
                                                                                            ))}

                                                                                    </Field>
                                                                                    {typeof errors.departments === "string" ?
                                                                                        (
                                                                                            <Typography className="err_m" >
                                                                                                All Roles Are Required
                                                                                            </Typography>

                                                                                        ) : undefined}
                                                                                </div>
                                                                                {index > 1 && <div >
                                                                                    <IconButton
                                                                                        color="primary"
                                                                                        onClick={() => remove(index)}
                                                                                        className="remove_button"
                                                                                    >
                                                                                        <Tooltip title={"Remove"} aria-label="Remove" >
                                                                                            <HighlightOffIcon />
                                                                                        </Tooltip>
                                                                                    </IconButton>
                                                                                </div>}
                                                                            </div>
                                                                        </Paper>
                                                                    );
                                                                })}
                                                            </React.Fragment>
                                                        )}
                                                    </FieldArray>
                                                </Grid>
                                            </div>
                                            <Divider />
                                            <Grid className='split_displya_button_p' >
                                                <Button
                                                    type='submit'
                                                    endIcon={<DoneIcon />}
                                                    className='split_displya_button'
                                                    size='large'
                                                    variant="contained"
                                                    color="primary">
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </Paper >
            </div >
        </>
    );
};


function mapStateToProps(state) {
    return {
        props: state.props,
    };
}

export default connect(mapStateToProps, {
    getroledata,
    getroledatavalues,
    PostSplitdepartmentdta,
})(SplitDepartmentDisplay);

