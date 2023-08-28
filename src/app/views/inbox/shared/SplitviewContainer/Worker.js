import React from "react";
import { useState } from "react";

export const SplitViewContext = React.createContext();

const SplitViewProvider = ({ children }) => {
  const [tabIndex, settabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState("one");
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  
  return (
    <SplitViewContext.Provider
      value={{
        tabIndex,
        loading,
        alignment,
        settabIndex,
        setLoading,
        handleAlignment,
      }}
    >
      {children}
    </SplitViewContext.Provider>
  );
};

export default SplitViewProvider;
