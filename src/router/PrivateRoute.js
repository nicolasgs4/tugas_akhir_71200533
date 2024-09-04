import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = () => {
    const cookie = useCookies(['skripsi-form']);
    if (!cookie[0]["skripsi-form"]) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;