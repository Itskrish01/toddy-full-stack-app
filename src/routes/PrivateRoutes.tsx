import { Navigate, Route, Routes } from 'react-router-dom';
import TodoApp from '../screens/TodoApp';
import EditModal from '../components/EditModal';


export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<TodoApp />}>
                <Route path='/todo/:id' element={<EditModal />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};