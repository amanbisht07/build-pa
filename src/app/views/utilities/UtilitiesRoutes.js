// import {MatxLoadable} from "./../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Color = Loadable(()=>import('./Color'),{
  fallback:<Loading/>
})
const Spacing = Loadable(()=>import('./Spacing'),{
  fallback:<Loading/>
})
const Display = Loadable(()=>import('./Display'),{
  fallback:<Loading/>
})

const utilitiesRoutes = [
  {
    path: '/utilities/color',
    component: Color
  },
  {
    path: "/utilities/spacing",
    component: Spacing
  },
  {
    path: "/utilities/display",
    component: Display
  },
]

export default utilitiesRoutes;
