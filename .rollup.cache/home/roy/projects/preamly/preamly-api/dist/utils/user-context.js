"use client";
import React, { useState, useEffect } from "react";
import { Role, Kind } from "../graphql/codegen-server/schema-types";
export const UserContext = React.createContext({
    isLoggedIn: false,
    user: null,
});
export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        user: null,
    });
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            // perform the logic to check auth for current user
            // right now, just use the first user in the list as logged-in
            setUser({
                isLoggedIn: true,
                user: {
                    firstName: "Roy",
                    lastName: "McClanahan",
                    password: "password",
                    roles: [Role.User],
                    email: "roy@test.com",
                    id: "2342323",
                    kind: Kind.User,
                },
            });
        };
        fetchLoggedInUser();
    });
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
//# sourceMappingURL=user-context.js.map