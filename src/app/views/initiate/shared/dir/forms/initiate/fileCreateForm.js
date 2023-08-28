import React from 'react';
import {Field, reduxForm} from 'redux-form';
// import TextField from 'material-ui/TextField';

const styleObj =
    {
        marginBottom:"3vw",
        textAlign: "center",
    }
// const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
//     <TextField hintText={label}
//                floatingLabelText={label}
//                errorText={touched && error}
//                {...input}
//                {...custom}
//     />
// )
const SimpleForm = props => {
    const {handleSubmit} = props
    return (
        <form onSubmit={handleSubmit}>
            <div style={styleObj}>
                Circulation File <br/>
                These Files are for Circulation with other Offices
            </div>

                    {/* <Container> */}
                        {/* <Row>
                            <Col sm={4}>
                                <div>
                                    <label>Branch</label>
                                    <div>
                                        <Field name="branch" component="input" type="text" placeholder="Branch"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Directorate</label>
                                    <div>
                                        <Field name="directorate" component="input" type="text" placeholder="Directorate"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Section</label>
                                    <div>
                                        <Field name="section" component="input" type="text" placeholder="Section"/>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <div>
                                    <label>Directorate Code</label>
                                    <div>
                                        <Field name="directorate_code" component="input" type="text" placeholder="Directorate Code"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Old File</label>
                                    <div>
                                        <Field name="old_file" component="input" type="text" placeholder="Old File"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Series</label>
                                    <div>
                                        <Field name="series" component="input" type="text" placeholder="Series"/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <div>
                                    <label>Classification</label>
                                    <div>
                                        <Field name="classification" component="input" type="text" placeholder="Classification"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Date Created</label>
                                    <div>
                                        <Field name="date_created" component="input" type="text" placeholder="Date Created"/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div>
                                    <label>Subject</label>
                                    <div>
                                        <Field name="subject" component="input" type="text" placeholder="Subject"/>
                                    </div>
                                </div>
                            </Col>
                        </Row> */}

                    {/* </Container> */}
                    {/* <Button type="submit">
                        Create
                    </Button> */}
                </form>
            );
}

export default reduxForm({
    form: 'simple' // a unique identifier for this form
})(SimpleForm);
