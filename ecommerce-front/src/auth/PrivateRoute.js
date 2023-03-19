import { Navigate, useLocation} from 'react-router-dom';
import { isAuthenticated } from '.';

const PrivateRoute = ({ children }) => {
    const {location} = useLocation();
    return (
        isAuthenticated()  && isAuthenticated().user.role === 0 ? (
            children
        ) : (
            <Navigate to={{ pathname: "/signin", state: { from: location } }} />))
}


export default PrivateRoute
