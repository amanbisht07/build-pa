import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Logout = Loadable(() => import("./logout/Logout"), {
  fallback: <Loading />,
});

const logoutRoutes = [
  {
    name:"Logout",
    path: "/eoffice/Logout",
    component: Logout,
    auth: authRoles.admin,
  },
];

export default logoutRoutes;
