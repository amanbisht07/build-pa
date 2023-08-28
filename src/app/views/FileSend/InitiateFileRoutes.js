// import { MatxLoadable } from "./../../../matx";
import {authRoles} from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const FileSend = Loadable(()=>import('./FileSend'),{
    fallback:<Loading/>
  })
const initiateFileRoutes = [
    {
        path: "/costa/file/send",
        component: FileSend,
        auth: authRoles.admin
    }
];

export default initiateFileRoutes;
