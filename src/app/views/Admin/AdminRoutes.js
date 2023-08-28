// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const AdminPage = Loadable(()=>import('./AdminHome'),{
  fallback:<Loading/>
})

const Admin = [
  {
    path: "/eoffice/admin/dashboard",
    component: AdminPage,
    auth: authRoles.admin
  }
];

export default Admin;