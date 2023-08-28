// import { MatxLoadable } from "matx";
// import { authRoles } from "../../auth/authRoles";

// const RTI = MatxLoadable({
//   loader: () => import("../RTI/sharedComponents/RtiRegister"),
// });

// const SplitView = MatxLoadable({
//   loader: () => import("./sharedComponents/PartCase"),
// });

// const RtiRoutes = [
//   {
//     path: "/eoffice/rti/file",
//     component: RTI,
//     auth: authRoles.admin,
//   },
//   {
//     path: "/eoffice/rti/splitView/file",
//     component: SplitView,
//     auth: authRoles.admin,
//   },
// ];

// export default RtiRoutes;


import { authRoles } from "../../auth/authRoles";
// import {MatxLoadable} from "../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const RTI = Loadable(() => import("../RTI/sharedComponents/RtiRegister"), {
  fallback: <Loading />
})


const RtiRoutes = [
  {
    path: "/eoffice/rti/file",
    component: RTI,
    auth: authRoles.admin,
  },
  // {
  //   path: "/eoffice/rti/splitView/file",
  //   component: SplitView,
  //   auth: authRoles.admin,
  // },
];

export default RtiRoutes;
