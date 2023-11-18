import {Navigate} from "react-router-dom";
import Root from "./routes/root";
import {isUserAdmin, isUserLoggedIn} from "./utils/authUtils";

const ProtectedRoutes = ({onlyAdmin= false}) => {

    if (isUserLoggedIn()) {
        if (onlyAdmin) {
            if (isUserAdmin()) {
                return <Root />;
            } else {
                return <Navigate to="/access-denied" replace />;
            }
        } else {
            return <Root />;
        }
    }
    return <Navigate to="/access-denied" replace />;

}

export default ProtectedRoutes;
