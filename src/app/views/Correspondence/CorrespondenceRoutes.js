// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Correspondence = Loadable(() => import("./Correspondence"), {
  fallback: <Loading />,
});

const CorrespondenceRoutes = [
  {
    name:"Correspondence File",
    path: "/eoffice/correspondence/file",
    component: Correspondence,
    auth: authRoles.admin,
  },
];

export default CorrespondenceRoutes;
