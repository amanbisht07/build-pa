import React from "react";
import routes from "./RootRoutes";
import LicenseConfig from "../license.json";

const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const validRoutes = routes.filter((route, ind) => {
    if (LicenseConfig.hideRoutes.includes(route.path)) return false;
    else return true;
  });

  return (
    <AppContext.Provider value={{ validRoutes, LicenseConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

