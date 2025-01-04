import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
const UserProtected = ({ children }) => {
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.user);
    console.log(user, "userdata");
    useEffect(() => {
        if (!token || !user) {
            console.log("ss");
            navigate('/', { replace: true });
        }
        else if (user?.is_blocked) {
            navigate('/', { replace: true });
        }
    }, [token, user]);
    if (token && user) {
        return children;
    }
};
export default UserProtected;
