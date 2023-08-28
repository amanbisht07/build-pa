export const SET_PASSDATA = "teamly/settings/SET_PASSDATA";

export const SET_INSTANCE_LOAD = "SET_INSTANCE_LOAD";

export const SET_PDF_INSTANCE = "SET_PDF_INSTANCE";

const initialState = {
  messageToPassUrl: "",
  extension: "docx",
  instanceLoadBln: false,
  pdfInstance: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PASSDATA:
      const { url, extension } = action.data;
      return {
        ...state,
        messageToPassUrl: url,
        extension,
      };
    case SET_INSTANCE_LOAD:
      const { instanceLoadBln } = action;
      return {
        ...state,
        instanceLoadBln,
      };
    case SET_PDF_INSTANCE:
      const { pdfInstance } = action;
      return {
        ...state,
        pdfInstance,
      };
    default:
      return state;
  }
};

export const setPassData = (data) => ({
  type: SET_PASSDATA,
  data,
});

export const instanceLoadBln = (instanceLoadBln) => ({
  type: SET_INSTANCE_LOAD,
  instanceLoadBln,
});

export const setPdfInstance = (pdfInstance) => ({
  type: SET_PDF_INSTANCE,
  pdfInstance,
});
