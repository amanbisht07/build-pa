// import { MatxLoadable } from "./../../../matx";
import {authRoles} from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const FileApproval = Loadable(()=>import('./FileApproval'),{
    fallback:<Loading/>
  })
  
const fileApproveRoutes = [
    {
        path: "/costa/file/approval",
        component: FileApproval,
        auth: authRoles.admin
    }
];

export default fileApproveRoutes;
