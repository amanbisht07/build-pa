import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";
import LayoutReducer from "./LayoutReducer";
import ScrumBoardReducer from "./ScrumBoardReducer";
import NotificationReducer from "./NotificationReducer";
import EcommerceReducer from "./EcommerceReducer";
import LoadReducer from "./LoadReducer";
import InboxReducer from "./InboxReducer";
import RefreshReducer from "./RefreshReducer";
import Refresh1Reducer from "./Refresh1Reducer";
import CreatePersonalReducer from "./CreatePersonalReducer";
import CreateFileReducer from "./CreateFileReducer";
import SendReducer from "./SendReducer";

const RootReducer = combineReducers({
  login: LoginReducer,
  user: UserReducer,
  layout: LayoutReducer,
  scrumboard: ScrumBoardReducer,
  notification: NotificationReducer,
  ecommerce: EcommerceReducer,
    loader: LoadReducer,
    inboxData: InboxReducer,
    refreshing: RefreshReducer,
    refreshings:Refresh1Reducer,
    createpersonal: CreatePersonalReducer,
    createfile: CreateFileReducer,
    sendfile: SendReducer
});

export default RootReducer;
