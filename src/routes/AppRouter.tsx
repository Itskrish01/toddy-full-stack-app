import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { TokenContext } from "../context/TokenContext";
import { Layout } from "../components/Layout";

export const AppRouter = () => {
    const tokenContext = useContext(TokenContext);

    const userAuthenticated = tokenContext?.userAuthenticated ?? null;


    if (!userAuthenticated) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<PublicRoutes />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<PrivateRoutes />} />
                </Routes>
            </BrowserRouter>
        </Layout>
    );
};
