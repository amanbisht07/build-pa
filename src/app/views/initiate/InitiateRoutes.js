// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./File"), {
  fallback: <Loading />,
});

const startProcess = Loadable(
  () => import("./shared/startProcess/StartProcessPage"),
  {
    fallback: <Loading />,
  }
);

const initiateRoutes = [
  {
    path: "/eoffice/initiate/file",
    component: File,
    auth: authRoles.admin,
  },

  // {
  //   path: "/eoffice/:processDefinitionId/:taskId",
  //   component: File
  // }
];

export default initiateRoutes;
