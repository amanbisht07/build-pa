import { authRoles } from "../../auth/authRoles";
// import {MatxLoadable} from "../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./folder/Cabinet"), {
  fallback: <Loading />,
});

const cabinetRoutes = [
  {
    name:"Cabinet",
    path: "/eoffice/cabinet/file",
    component: File,
    auth: authRoles.admin,
  },
];

export default cabinetRoutes;
