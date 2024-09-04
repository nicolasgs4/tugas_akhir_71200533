import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies, CookiesProvider } from "react-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [cookie, setCookie, removeCookie] = useCookies(['skripsi-form']);

    const navigate = useNavigate();
    const loginAction = async (data) => {
        try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();

        if (res) {
            setCookie("skripsi-form", res.token, {maxAge: 3600});
            navigate("/dashboard");
            return;
        }
        throw new Error(res.message);
        } catch (err) {
        console.error(err);
        }
    };

    const logOut = () => {
        removeCookie("skripsi-form");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{loginAction, logOut }}>
            <CookiesProvider setCookie={loginAction} removeCookie={logOut}>
                {children}
            </CookiesProvider>
        </AuthContext.Provider>
        
        );
    };

    export default AuthProvider;

    export const useAuth = () => {
        return useContext(AuthContext);
};