import { Navigate, Route, Routes } from 'react-router-dom';
import RegisterPage from '../screens/RegisterPage';
import LoginPage from '../screens/LoginPage';

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};