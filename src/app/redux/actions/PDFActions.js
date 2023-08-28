export const PDF_SETTINGS = "PDF_SETTINGS";

export const setPDFSettings = (data) => dispatch => {
  dispatch({
    type: PDF_SETTINGS,
    data: data
  });
};
