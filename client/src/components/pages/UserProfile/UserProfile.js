import {Button, Container} from "react-bootstrap";
import {getLoggedInUser} from "../../../utils/authUtils";
import {useState} from "react";
import EditProfileForm from "./EditProfileForm";
import {useGetUserQuery} from "../../../apis/userApi";

const UserProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const {data: user, error: userError, isLoading: isUserLoading} = useGetUserQuery(getLoggedInUser()?.id);


    // Switch between edit and read-only mode
    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const onSuccess = () => {
        setEditMode(false);
    }

    const renderProfile = () => {
        if (isUserLoading) {
            return <p>Loading...</p>;
        } else if (userError) {
            return <p>Error loading user: {JSON.stringify(userError, null, 2)}</p>;
        }
        if (editMode) {
            return <EditProfileForm userData={user} onCancel={handleEditClick} onSuccess={onSuccess}/>;
        }
        return (
            <>
                <div style={{marginBottom: "10px"}}>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Email Address: {user.email}</p>
                </div>
                <Button onClick={handleEditClick}>Edit Profile</Button>
            </>
        )
    }

    return (
        <Container>
            <h1>User Profile</h1>
            {renderProfile()}

        </Container>
    );
}

export default UserProfile;
