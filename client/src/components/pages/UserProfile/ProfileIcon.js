import './ProfileIcon.css';
import {getLoggedInUser} from "../../../utils/authUtils";
import {useGetUserQuery} from "../../../apis/userApi";

const ProfileIcon = () => {
   const {data: user, error: userError, isLoading: isUserLoading} = useGetUserQuery(getLoggedInUser()?.id);

    const getUserInitials = (profileUser) => {
        if (!profileUser) {
            return '?';
        }
        const {firstName, lastName} = profileUser
        const firstInitial = firstName && firstName.length > 0 ? firstName[0] : '';
        const lastInitial = lastName && lastName.length > 0 ? lastName[0] : '';
        return `${firstInitial}${lastInitial}`;
    }

    const renderProfileIcon = () => {
        let profileString = '';
        if (isUserLoading) {
            profileString = '...';
        } else if (userError) {
            profileString = '!';
            console.log(`Error loading user: ${JSON.stringify(userError, null, 2)}`)
        }
        if (user) {
            profileString = getUserInitials(user);
        }

        return (
            <div className="profileIcon">
                <p>{profileString}</p>
            </div>
        )
    }

    return renderProfileIcon()

}

export default ProfileIcon;