import { authRoles } from "../../auth/authRoles";
// import {MatxLoadable} from "../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(()=>import('./DmsTable'),{
  fallback:<Loading/>
})

const dmsRoutes = [
  {
    name:"Dms",
    path: "/eoffice/dms/DmsFolderStructure/dmsTable",
    component: File,
    auth: authRoles.admin
  }
];

export default dmsRoutes;