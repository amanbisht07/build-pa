// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";

const FileSend = Loadable(() => import("./FileSend"), {
  fallback: <Loading />,
});

const startProcess = Loadable(
  () => import("./shared/startProcess/StartProcessPage"),
  {
    fallback: <Loading />,
  }
);

const initiateFileRoutes = [
  {
    path: "/costa/initiate/file/send",
    component: FileSend,
  },
];

export default initiateFileRoutes;
