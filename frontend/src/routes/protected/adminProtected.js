import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const { admin, token } = useSelector((state) => state.admin);
    useEffect(() => {
        if (!token) {
            navigate('/admin', { replace: true });
        }
    }, []);
    if (token && admin) {
        return children;
    }
};
export default AdminProtected;
