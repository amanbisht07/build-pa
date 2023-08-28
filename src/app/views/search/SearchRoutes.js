import { authRoles } from "../../auth/authRoles";
// import { MatxLoadable } from "../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

// const File = MatxLoadable({
//   loader: () => import("./SearchTable"),
// });
const File = Loadable(() => import("./SearchTable"), {
  fallback: <Loading />
})

const SearchRoutes = [
  {
    path: "/eoffice/search",
    component: File,
    auth: authRoles.admin,
  },
];

export default SearchRoutes;
