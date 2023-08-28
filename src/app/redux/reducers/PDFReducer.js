import {
  PDF_SETTINGS,

} from "../actions/PDFActions";

const initialState = {
  filePath: "http://www.africau.edu/images/default/sample.pdf",
  personalId: null,
  annotationId:null
}

const PDFReducer = (state = [], action) => {
  switch (action.type) {
    case PDF_SETTINGS:{
      const pdfSettings = action.data;
      return {
        ...state,
        pdfSettings
      };
    }

    default:
      return { ...state };
  }
};

export default PDFReducer;
