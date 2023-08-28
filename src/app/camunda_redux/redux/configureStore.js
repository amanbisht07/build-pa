import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import api from "./../../middleware/api";
import backend from "./../../middleware/backend";
import rootReducer from "./reducer/index";
import backendPA from "../../middleware/backendPA";
import backendMIS from "../../middleware/backendMIS";
import backendSau from "../../middleware/backendSau";
import backend_axios from "../../middleware/backend_axios";
import backend_annexure from "../../middleware/backend_annexure";
import advance_search from "../../middleware/advance_search";
import backend_annotation from "app/middleware/backend_annotation";
import backend_createPA from "app/middleware/backend_createPA";
import backend_createPF from "app/middleware/backend_createPF";
import backend_hrm from "app/middleware/backend_hrm";
import backend_personalinfo from "app/middleware/backend_personalinfo";
import backend_retrieval from "app/middleware/backend_retrieval";
import backend_send from "app/middleware/backend_send";
import backend_sign from "app/middleware/backend_sign";
import backend_userManagement from "app/middleware/backend_userManagement";
import backend_util from "app/middleware/backend_util";
import back_microproject from "app/middleware/backend_microproject";
import backend_partCase from "app/middleware/backend_partCase";
import backend_merge_pc from "app/middleware/backend_merge_pc";
import backend_forward from "app/middleware/backend_forward";
import backend_history from "app/middleware/backend_history";
import backend_camunda_pa from "app/middleware/backend_camunda_pa";
import backend_enclosure_axios from "../../middleware/backend_enclosure_axios";
import backend_rti from "app/middleware/backend_rti";
import rtiBackend_axios from "app/middleware/rtiBackend_axios";
import backend_register from "app/middleware/backend_register";
import { composeWithDevTools } from "redux-devtools-extension";
import notification_service from "../../middleware/notification_service";
import URL_hide from "app/middleware/URL_hide";
import backend_admin_dashboard from "app/middleware/Admin/backend_admin_dashboard";
import backend_admin_users from "app/middleware/Admin/backend_admin_users";
import backend_admin_roles from "app/middleware/Admin/backend_admin_roles";
import backend_admin_departments from "app/middleware/Admin/backend_admin_departments";
import split_department from "app/middleware/split_department";
import file_service from "app/middleware/backend_file";
import backend_correspondence from "app/middleware/backend_correspondence";

const configureStore = (preloadedState) =>
  createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        api,
        backend,
        backendPA,
        backendMIS,
        backendSau,
        backend_axios,
        backend_annexure,
        advance_search,
        backend_annotation,
        backend_createPA,
        backend_createPF,
        backend_correspondence,
        backend_hrm,
        backend_personalinfo,
        backend_retrieval,
        backend_send,
        backend_sign,
        backend_userManagement,
        backend_util,
        back_microproject,
        backend_partCase,
        backend_merge_pc,
        backend_forward,
        backend_history,
        backend_enclosure_axios,
        notification_service,
        URL_hide,
        backend_camunda_pa,
        backend_admin_dashboard,
        backend_admin_users,
        backend_admin_roles,
        backend_admin_departments,
        backend_rti,
        rtiBackend_axios,
        backend_register,
        split_department,
        file_service
      )
    )
  );

export default configureStore;
