import {Navigate} from "react-router-dom";
import MainMenu from "../components/layout/MainMenu/MainMenu";
import {isUserAdmin, isUserLoggedIn} from "../utils/authUtils";

const ProtectedRoutes = ({onlyAdmin= false}) => {

    if (isUserLoggedIn()) {
        if (onlyAdmin) {
            if (isUserAdmin()) {
                return <MainMenu />;
            } else {
                return <Navigate to="/access-denied" replace />;
            }
        } else {
            return <MainMenu />;
        }
    }
    return <Navigate to="/access-denied" replace />;

}

export default ProtectedRoutes;
