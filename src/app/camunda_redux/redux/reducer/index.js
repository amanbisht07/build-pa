import * as ActionTypes from "../constants/ActionTypes";
import merge from "lodash/merge";
import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import LoginReducer from "../../../redux/reducers/LoginReducer";
import UserReducer from "../../../redux/reducers/UserReducer";
import LayoutReducer from "../../../redux/reducers/LayoutReducer";
import PDFReducer from "../../../redux/reducers/PDFReducer";
import ScrumBoardReducer from "../../../redux/reducers/ScrumBoardReducer";
import NotificationReducer from "../../../redux/reducers/NotificationReducer";
import EcommerceReducer from "../../../redux/reducers/EcommerceReducer";
import snackbarReducer from "../ducks/snackbar";
import passDataReducer from "../ducks/passData";
import notificationDataReducer from "../ducks/notification";
import passDataInboxReducer from "../ducks/passDataInbox";
import instanceStoreReducer from "../ducks/instanceStore";
import apiTrigger from "./apiTrigger";
import LoadReducer from "../../../redux/reducers/LoadReducer";
import InboxReducer from "../../../redux/reducers/InboxReducer";
import RefreshReducer from "../../../redux/reducers/RefreshReducer";
import Refresh1Reducer from "../../../redux/reducers/Refresh1Reducer";
import CreatePersonalReducer from "../../../redux/reducers/CreatePersonalReducer";
import CreateFileReducer from "../../../redux/reducers/CreateFileReducer";
import SendReducer from "../../../redux/reducers/SendReducer";
import theme from "../../../redux/reducers/themeReducer";
import subjectReducer from "../../../redux/reducers/subjectReducer";
import fileSubjectReducer from "../../../redux/reducers/fileSubjectReducer";
import myInfo from "../../../redux/reducers/myInfoReducer";
import changeFile from "../../../redux/reducers/changeFile";
import openDraftPa from "../../../redux/reducers/openDraftPa";
import DraftTableReducer from "../../../redux/reducers/PA/DraftTableReducer";
import OutboxReducer from "../../../redux/reducers/Outbox/OutboxReducer";
import FileViewReducer from "../../../redux/reducers/PA/FileViewReducer";
import InboxDataReducer from "../../../redux/reducers/Inbox/InboxDataReducer";
import DashboardDataReducer from "../../../redux/reducers/Dashboard/DashboardDataReducer";
import PATableReducer from "../../../redux/reducers/PA/PATableReducer";
import { getTabledata } from "app/redux/reducers/UserActivaty";
import AdminDasboardReducer from "../../../redux/reducers/Admin/Dashboard";
import UsersReducer from "app/redux/reducers/Admin/Users";
import RolesReducer from "app/redux/reducers/Admin/Roles";
import DepartmentsReducer from "app/redux/reducers/Admin/Departments";
import rtiReducer from "../../../redux/reducers/Rti";
import {
  getDepartment,
  getuserName,
  getAllMeeting,
  getAllMeetingDepartment,
  getInboxDatas,
  sendToChairman,
  ChairamInboxMeeting,
  chairManApproveMeeting,
  chairManAndUserRejectMeeting,
  AttendeesReducer,
  getAllComment,
  getUserAttendee,
  userForwardMeeting,
  userAcceptRejectdMeeting,
  AgendaReducer,
  rescheduledMeeting,
  initiatorCancelMeeting,
  initiatorDecisionMeeting,
  initiatorTaskActionPoints,
  InitiatorPostAttachDocument,
  MeetingMemo,
  getAttendingGroup,
  externalAttendees,
  freezeAgenda,
} from "app/redux/reducers/MeetingReducers";
import getDepartments from "app/redux/reducers/getDepartmentReducer";
import createMeetings from "app/redux/reducers/createMeetingReducre";
import signReducer from "app/redux/reducers/currentSignReducer";
import routeReducer from "app/redux/reducers/routesReducer";

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {}, action) => {
  const { type } = action;
  if (
    type === ActionTypes.TASK_SUBMITTED_SUCCESS ||
    type === ActionTypes.TASK_SUBMITTED_FAILURE
  ) {
    return merge({}, state, {
      redirect: "/eoffice/",
    });
  } else {
    state = merge({}, state, {
      redirect: null,
    });
  }
  if (type === ActionTypes.NEW_PROCESS_INSTANCE_SUCCESS) {
    state.formKey = null;
  }
  if (type === ActionTypes.FORM_KEY_SUCCESS) {
    state.processInstanceStarted = null;
  }
  if (type === ActionTypes.TASKS_SUCCESS) {
    state.task = null;
  }

  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }
  return state;
};

const rootReducer = combineReducers({
  form: reduxFormReducer,
  entities,
  login: LoginReducer,
  user: UserReducer,
  layout: LayoutReducer,
  pdf: PDFReducer,
  scrumboard: ScrumBoardReducer,
  notification: NotificationReducer,
  ecommerce: EcommerceReducer,
  snackbar: snackbarReducer,
  passData: passDataReducer,
  notificationFun: notificationDataReducer,
  passDataInbox: passDataInboxReducer,
  instanceStore: instanceStoreReducer,
  subscribeApi: apiTrigger,
  loader: LoadReducer,
  refreshing: RefreshReducer,
  refreshings: Refresh1Reducer,
  createpersonal: CreatePersonalReducer,
  createfile: CreateFileReducer,
  sendfile: SendReducer,
  inboxer: InboxReducer,
  DraftTableReducer: DraftTableReducer,
  outbox: OutboxReducer,
  filepa: FileViewReducer,
  getInbox: InboxDataReducer,
  dashboard: DashboardDataReducer,
  PAData: PATableReducer,
  theme,
  subjectReducer,
  fileSubjectReducer,
  openDraftPa,
  changeFile,
  myInfo,
  getTabledata,

  rtiReducer,
  //meeting Module
  department: getDepartment,
  userName: getuserName,
  getAllMeeting: getAllMeeting,
  getDepartments: getDepartments,
  createMeetings: createMeetings,
  getAllMeetingDepartment: getAllMeetingDepartment,
  sendToChairman: sendToChairman,
  getInboxDatass: getInboxDatas,
  chairManMeeting: ChairamInboxMeeting,
  meetingApproved: chairManApproveMeeting,
  RejectMeeting: chairManAndUserRejectMeeting,
  AttendeesReducer: AttendeesReducer,
  AgendaReducer: AgendaReducer,
  getAllComments: getAllComment,
  UserAttendee: getUserAttendee,
  ForwardMeeting: userForwardMeeting,
  userMeetingAcceptRejectd: userAcceptRejectdMeeting,
  rescheduledMeeting: rescheduledMeeting,
  initiatorCancelMeeting: initiatorCancelMeeting,
  DecisionMeeting: initiatorDecisionMeeting,
  TaskActionPoints: initiatorTaskActionPoints,
  InitiatorPostAttachDocument,
  MeetingMemo: MeetingMemo,
  getGroupNames: getAttendingGroup,
  externalAttendees: externalAttendees,
  freezeAgenda: freezeAgenda,
  adminDashBoard: AdminDasboardReducer,
  adminUsers: UsersReducer,
  adminRoles: RolesReducer,
  adminDepartments: DepartmentsReducer,
  currentSign: signReducer,

  appRoutes: routeReducer, // to handle either show pa and all tab based on selected user
});

export default rootReducer;
