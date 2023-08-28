import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "../../../matx/components/MatxLoadable/Loading";

const SearchPrime = Loadable(() => import("./ParentComp/Audit_Search_Form"), {
  fallback: <Loading />,
});

const SearchPrimeRoutes = [
  {
    path: "/eoffice/auditsearch",
    component: SearchPrime,
    auth: authRoles.admin,
  },
];

export default SearchPrimeRoutes;
