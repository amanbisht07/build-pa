// import {MatxLoadable} from "./../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const AppDialog =Loadable(()=>import('./dialog/AppDialog'),{
      fallback:<Loading/>
  })
const AppIcon =Loadable(()=>import('./icons/AppIcon'),{
      fallback:<Loading/>
  })
const AppForm = Loadable(()=>import('./forms/AppForm'),{
      fallback:<Loading/>
  })


const materialRoutes = [
    {
        path: "/material/form",
        component: AppForm
    },
    {
        path: "/material/icons",
        component: AppIcon
    },
    {
        path: "/material/dialog",
        component: AppDialog
    },
]

export default materialRoutes;
