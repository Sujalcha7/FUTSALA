import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Configure axios to always send credentials
axios.defaults.withCredentials = true;

const AuthContext = createContext({
    user: null,
    setUser: () => {},
    isLoading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getUser = async () => {
        try {
            // Explicitly set withCredentials
            const response = await axios.get(
                "http://localhost:8000/api/current_user/",
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            if (response.data && Object.keys(response.data).length > 0) {
                setUser(response.data);
                // console.log(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
