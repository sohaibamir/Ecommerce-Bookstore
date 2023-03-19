import { Navigate, useLocation} from 'react-router-dom';
import { isAuthenticated } from '.';

const AdminRoute = ({ children }) => {
    const {location} = useLocation();
    return (
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
            children
        ) : (
            <Navigate to={{ pathname: "/signin", state: { from: location } }} />))
}


export default AdminRoute;
