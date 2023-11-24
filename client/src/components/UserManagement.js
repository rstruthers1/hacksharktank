import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {
    useCreateHackathonUserRoleMutation,
    useGetHackathonQuery,
    useGetHackathonUsersQuery
} from "../apis/hackathonApi";
import UserSearchModal from "./UserSearchModal";
import {toast} from "react-toastify";
import {getErrorMessage} from "../utils/errorMessageUtils";
import './UserManagement.css';

const UserManagement = () => {
    const {hackathonId} = useParams();
    const {
        data: hackathon,
        error: getHackathonError,
        isLoading: getHackathonIsLoading
    } = useGetHackathonQuery(hackathonId);
    const {
        data: hackathonUsers,
        error: getHackathonUsersError,
        isLoading: getHackathonUsersIsLoading
    } = useGetHackathonUsersQuery(hackathonId);
    const [createHackathonUserRole, {
        isLoading: createHackthonUserRoleIsLoading,
        isSuccess: createHackathonUserRoleIsSuccess,
        isError: createHackathonUserRoleIsError,
        data: createHackathonUserRoleData,
        error: createHackathonUserRoleError
    }] = useCreateHackathonUserRoleMutation();

    const [modalOpen, setModalOpen] = useState(false); // State to track whether the modal is open
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleAddUser = async selectedUser => {
        try {
            const hackathonUserRoleData = {
                hackathonId: hackathonId,
                userId: selectedUser?.value,
                hackathonRoles: ["participant"]
            };
            await createHackathonUserRole(hackathonUserRoleData).unwrap();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (createHackathonUserRoleIsSuccess) {
            toast.success('Successfully added user', {
                    position: toast.POSITION.TOP_CENTER
                }
            );
            closeModal();
        }
    }, [createHackathonUserRoleIsSuccess]);

    useEffect(() => {
        if (createHackathonUserRoleIsError) {
            toast.error(`Failed to add user: ${getErrorMessage(createHackathonUserRoleError)}`, {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    }, [createHackathonUserRoleIsError, createHackathonUserRoleError]);


    return (
        <div>

            {getHackathonError ? (
                <>Oh no, there was an error</>
            ) : getHackathonIsLoading ? (
                <>Loading...</>
            ) : hackathon ? (
                <div>
                    <h1>{hackathon.eventName}</h1>
                    <h2>Manage Users</h2>
                    <Button onClick={openModal}>Add User</Button>
                    {createHackthonUserRoleIsLoading && <p>Adding user...</p>}
                    <div className="user-management">
                        {hackathonUsers &&
                            <ul className="user-list">
                                {hackathonUsers.map(user => (
                                    <li key={user.id}>
                                        {user.email} - Roles: {Array.isArray(user?.hackathonRoles) ?
                                        user.hackathonRoles.join(', ') : ''}
                                    </li>
                                ))}
                            </ul>
                        }
                        {getHackathonUsersIsLoading && <p>Loading users...</p>}
                        {getHackathonUsersError && <p>Failed to load users</p>}
                    </div>
                </div>
            ) : null}
            {
                modalOpen &&
                <UserSearchModal
                    show={modalOpen}
                    handleClose={closeModal}
                    handleSelect={handleAddUser}
                />
            }
        </div>
    )
}

export default UserManagement;