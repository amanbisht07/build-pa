import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./File"), {
  fallback: <Loading />,
});

const LoginRoutes = [
  {
    path: "/eoffice/Cabinet/cabinetTable",
    component: File,
    auth: authRoles.admin,
  },
];

export default LoginRoutes;
