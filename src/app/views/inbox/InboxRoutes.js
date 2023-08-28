// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./File"), {
  fallback: <Loading />,
});

const HrmConcernedAgencyView = Loadable(() => import("./shared/HrmConcerned"), {
  fallback: <Loading />,
});

// const SplitView = Loadable(() => import("./shared/SplitView"), {
//   fallback: <Loading />,
// });

const SplitContainer = Loadable(
  () => import("./shared/SplitviewContainer/index"),
  {
    fallback: <Loading />,
  }
);

const inboxRoutes = [
  {
    name:"Inbox",
    path: "/eoffice/inbox/file",
    component: File,
    auth: authRoles.admin,
  },
  {
    name:"Inbox Pa",
    path: "/eoffice/hrmConcernedView/file",
    component: HrmConcernedAgencyView,
    auth: authRoles.admin,
  },
  {
    name:"Inbox SplitView",
    path: "/eoffice/splitView/file",
    component: SplitContainer,
    auth: authRoles.admin,
  },
];

export default inboxRoutes;
