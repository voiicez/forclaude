import React, { createContext, useState } from "react";

export const SharedStringContext = createContext();

const SharedStringProvider = ({ children }) => {
  const [sharedString, setSharedString] = useState("");

  return (
    <SharedStringContext.Provider value={{ sharedString, setSharedString }}>
      {children}
    </SharedStringContext.Provider>
  );
};

export default SharedStringProvider;
