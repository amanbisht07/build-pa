// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Analytics = Loadable(() => import("./shared"), {
  fallback: <Loading />,
});

const FileRoutes = [
  {
    path: "/eoffice/File/file",
    component: Analytics,
    auth: authRoles.admin,
  },
];

export default FileRoutes;
