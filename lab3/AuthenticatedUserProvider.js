import React, { useState, createContext } from 'react';
export const AuthenticatedUserContext = createContext({user: null,
    setUser: () => {},});
export const AuthenticatedUserProvider = ({ children }) => {
const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
        {children}
    </AuthenticatedUserContext.Provider>
);
};