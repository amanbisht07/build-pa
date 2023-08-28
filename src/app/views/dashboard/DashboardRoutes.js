// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component"
import Loading from "matx/components/MatxLoadable/Loading";

const Analytics = Loadable(()=>import('./Analytics'),{
  fallback:<Loading/>
})

const dashboardRoutes = [
  {
    name:"Dashboard",
    path: "/eoffice/dashboard/analytics",
    component: Analytics,
    auth: authRoles.admin
  }
];

export default dashboardRoutes;
