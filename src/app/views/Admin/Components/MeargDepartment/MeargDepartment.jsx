import React from 'react';
import './mearg.css';
import { Grid, Paper, TextField, Button, Divider } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { Autocomplete } from '@material-ui/lab';
import { useFormik } from 'formik';
import * as Yup from "yup";


const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 }
];

const MeargDepartment = (props) => {

    const initialValues = {
        DptSelect: [],
        dptNewName: "",
        dptDisName: "",
        DptCordRole: "",
        DptDisc: ""
    }

    const validationSchema = Yup.object().shape({
        DptSelect: Yup.array().required("Select Department").min(2, 'Select Minmum Two Department'),
        dptNewName: Yup.string().required("Enter Department New Name"),
        dptDisName: Yup.string().required("Enter Department Display Name "),
        DptCordRole: Yup.string().required("Enter Department Cord Role"),
        DptDisc: Yup.string().required("Enter Description")
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("SUMBIT VALUES", values)
            formik.resetForm()
        }
    })

    return (
        <>
            <div className='mearg_main_div'>
                <Paper
                    elevation={3}
                    style={{ width: "100%", border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}` }}
                >
                    <div className='paper_merag' >
                        <div className='Mrg_heading' >
                            <h4>MERGE DEPARTMENT </h4>
                        </div>
                        <Divider />
                        <form onSubmit={formik.handleSubmit} >
                            <div className='mrg_form_grid' >
                                <Grid container spacing={3} style={{ padding: "1.5rem" }} >
                                    <Grid item xs={12} >
                                        <Autocomplete
                                            fullWidth
                                            size='small'
                                            multiple
                                            name='DptSelect'
                                            id="tags-outlined"
                                            options={top100Films}
                                            value={formik.values.DptSelect}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("DptSelect", newValue)
                                            }}
                                            getOptionLabel={(option) => option.title}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select Department"
                                                    placeholder="Departments"
                                                    error={formik.touched.DptSelect && Boolean(formik.errors.DptSelect)}
                                                    helperText={formik.touched.DptSelect && formik.errors.DptSelect}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Department New Name"
                                            variant="outlined"
                                            size='small'
                                            autoComplete='off'
                                            name='dptNewName'
                                            value={formik.values.dptNewName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.dptNewName && Boolean(formik.errors.dptNewName)}
                                            helperText={formik.touched.dptNewName && formik.errors.dptNewName}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label=" Department Display Name "
                                            variant="outlined"
                                            size='small'
                                            autoComplete='off'
                                            name='dptDisName'
                                            value={formik.values.dptDisName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.dptDisName && Boolean(formik.errors.dptDisName)}
                                            helperText={formik.touched.dptDisName && formik.errors.dptDisName}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Department Cord Role "
                                            variant="outlined"
                                            size='small'
                                            autoComplete='off'
                                            name='DptCordRole'
                                            value={formik.values.DptCordRole}
                                            onChange={formik.handleChange}
                                            error={formik.touched.DptCordRole && Boolean(formik.errors.DptCordRole)}
                                            helperText={formik.touched.DptCordRole && formik.errors.DptCordRole}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Description"
                                            variant="outlined"
                                            size='small'
                                            autoComplete='off'
                                            name='DptDisc'
                                            value={formik.values.DptDisc}
                                            onChange={formik.handleChange}
                                            error={formik.touched.DptDisc && Boolean(formik.errors.DptDisc)}
                                            helperText={formik.touched.DptDisc && formik.errors.DptDisc}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <Divider />
                            <Grid container className='mrg_displya_button_p' >
                                <Grid item xs={10} ></Grid>
                                <Grid item xs={2}>
                                    <Button
                                        type='submit'
                                        endIcon={<DoneIcon />}
                                        size='large'
                                        variant="contained"
                                        color="primary"
                                        style={{ marginLeft: "15px" }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Paper >
            </div >
        </>
    )
}

export default MeargDepartment
