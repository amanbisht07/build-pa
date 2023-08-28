// https://github.com/tc39/proposal-export-ns-from#proposed-addition
// this can maybe be fixed in the future

import * as sampleForm from './sampleForm';
import * as sendFile from './sendFile';
import * as sendFormInbox from './sendFormInbox'
import * as personalFile from './personalFile'
import * as personalApplication from "./personalApplication";

export {sampleForm};
export {sendFile};
export {sendFormInbox};
export {personalFile};
export {personalApplication};