// import { MatxLoadable } from "./../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const BasicForm = Loadable(() => import("./BasicForm"), {
  fallback: <Loading />,
});

const EditorForm = Loadable(() => import("./EditorForm"), {
  fallback: <Loading />,
});

const formsRoutes = [
  {
    path: "/forms/basic",
    component: BasicForm,
  },
  {
    path: "/forms/editor",
    component: EditorForm,
  },
];

export default formsRoutes;
