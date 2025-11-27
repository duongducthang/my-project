// TODO: Implement AuthContext
import { createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // TODO: Implement auth provider
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
