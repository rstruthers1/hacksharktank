import './ProfileIcon.css';
import {getLoggedInUser} from "../../utils/authUtils";

const ProfileIcon = () => {
    const user = getLoggedInUser()
    const getUserInitials = (user) => {
        if (!user) {
            return '?';
        }
        const {firstName, lastName} = user;
        const firstInitial = firstName && firstName.length > 0 ? firstName[0] : '';
        const lastInitial = lastName && lastName.length > 0 ? lastName[0] : '';
        return `${firstInitial}${lastInitial}`;
    }
    return (user ?
        <div className="profileIcon">
            <p>{getUserInitials(user)}</p>
        </div>
         : (
            <div className="profileIcon">
                <p>?</p>
            </div>
        )
    );
}

export default ProfileIcon;