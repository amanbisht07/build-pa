// import {MatxLoadable} from "./../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Layout1 =Loadable(()=>import('./Layout1/Layout1'),{
  fallback:<Loading/>
})

export const MatxLayouts = {
  layout1: Layout1
}
