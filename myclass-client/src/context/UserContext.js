import React, { createContext, useReducer, useContext } from "react";
import reducer, { initialState } from "./Reducer";

export const UserContext = createContext();

export const UserProvider = ({ children }) => (
  <UserContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </UserContext.Provider>
);

const UserContextProvider = () => useContext(UserContext);

export default UserContextProvider;
