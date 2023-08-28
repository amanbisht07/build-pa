// import React from 'react'
// import {reduxForm} from 'redux-form'
// // import Form from 'react-bootstrap/Form';
// // import {Container} from "react-bootstrap";
// // import Row from 'react-bootstrap/Row';
// // import Col from 'react-bootstrap/Col';
// import {Field, Formik} from "formik";
// import {connect} from "react-redux";

// let SimpleForm = props => {
//     const { handleSubmit } = props
//     return (
//         <Formik
//             initialValues={{ branch: 'Material Branch', directorate: 'DIT', directorate_code:'',section:'', series: '', old_file: '',
//                 classification: '', date_created: '', subject: ''}}
//             validate={values => {
//                 // const errors = {};
//                 if (!values.section) {
//                     errors.section = 'Required';
//                 }
//                 return errors;
//             }}
//             onSubmit={(values, { setSubmitting }) => {
//                 setTimeout(() => {
//                     // alert(JSON.stringify(values, null, 2));
//                     setSubmitting(false);
//                     let val = JSON.stringify(values, null, 9);
//                     this.handleClick(val);
//                 }, 400);

//             }}
//         >
//             {({
//                   values,
//                   errors,
//                   touched,
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   isSubmitting,
//                   /* and other goodies */
//               }) => (
//                 // <Form onSubmit={handleSubmit} class="login100-form">
//                     <div className="login100-form-title p-b-70">
//                         Circulation File &nbsp
//                         These Files are for Circulation with other Offices
//                     </div>
//                     {/* <Container>
//                         <Row>
//                             <Col sm={6}>
//                             <div class="wrap-input100 m-t-85 m-b-35">
//                                 <Field
//                                     type="text"
//                                     name="branch"
//                                     class="input100"
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     value={values.branch}
//                                 />{errors.branch && touched.branch && errors.branch}
//                                 <span className="focus-input100"
//                                       data-placeholder="Branch"></span>
//                             </div>
//                             </Col>
//                             <Col sm={6}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="directorate"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.directorate}
//                                     />{errors.directorate && touched.directorate && errors.directorate}
//                                     <span className="focus-input100"
//                                           data-placeholder="Directorate"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="directorate_code"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.directorate_code}
//                                     />{errors.directorate_code && touched.directorate_code && errors.directorate_code}
//                                     <span className="focus-input100"
//                                           data-placeholder="Directorate Code"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="section"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.section}
//                                     />{errors.section && touched.section && errors.section}
//                                     <span className="focus-input100"
//                                           data-placeholder="Section"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="series"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.series}
//                                     />{errors.series && touched.series && errors.series}
//                                     <span className="focus-input100"
//                                           data-placeholder="Series"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="old_file"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.old_file}
//                                     />{errors.old_file && touched.old_file && errors.old_file}
//                                     <span className="focus-input100"
//                                           data-placeholder="Old File"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="classification"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.classification}
//                                     />{errors.classification && touched.classification && errors.classification}
//                                     <span className="focus-input100"
//                                           data-placeholder="Classification"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="date_created"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.date_created}
//                                     />{errors.date_created && touched.date_created && errors.date_created}
//                                     <span className="focus-input100"
//                                           data-placeholder="Date Created"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col sm={12}>
//                                 <div class="wrap-input100 m-t-85 m-b-35">
//                                     <Field
//                                         type="text"
//                                         name="subject"
//                                         class="input100"
//                                         onChange={handleChange}
//                                         onBlur={handleBlur}
//                                         value={values.subject}
//                                     />{errors.subject && touched.subject && errors.subject}
//                                     <span className="focus-input100"
//                                           data-placeholder="Subject"></span>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <div className="container-login100-form-btn">
//                             <button type="submit" disabled={isSubmitting} class="login100-form-btn">
//                                 Create
//                             </button>
//                         </div>
//                     </Container> */}
//                 // </Form>
//             )}
//         </Formik>
//     )
// }

// SimpleForm = reduxForm({
//     form: 'simpleForm',
//     enableReinitialize: true
// })(SimpleForm)
// SimpleForm = connect(
//     state => ({
//         initialValues: state.entities.taskVariables ? state.entities.taskVariables.variables : {}
//     })
// )(SimpleForm)
// export default SimpleForm