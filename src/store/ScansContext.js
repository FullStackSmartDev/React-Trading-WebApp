import React, { createContext, useReducer } from "react";
import ScansReducer from "../reducers/ScansReducer";

const initialState = {};

const ScansStore = ({ children }) => {
  const [scansState, scansDispatch] = useReducer(ScansReducer, initialState);
  return (
    <ScansContext.Provider value={[scansState, scansDispatch]}>
      {children}
    </ScansContext.Provider>
  );
};

export const ScansContext = createContext(initialState);
export default ScansStore;
