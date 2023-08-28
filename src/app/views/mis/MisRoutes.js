// import { MatxLoadable } from "./../../../matx";
import {authRoles} from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Mis =  Loadable(()=>import('./Mis'),{
    fallback:<Loading/>
  })

const MisRoutes = [
    {
        path: "/eoffice/mis/file",
        component: Mis,
        auth: authRoles.admin
    }
];

export default MisRoutes;