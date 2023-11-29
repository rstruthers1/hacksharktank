import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import {
    useCreateHackathonUserRoleMutation,
    useGetHackathonQuery,
    useGetHackathonUsersQuery,
    useDeleteHackathonUserRoleMutation,
    useDeleteHackathonUserMutation
} from "../../../apis/hackathonApi";
import UserSearchModal from "./UserSearchModal";
import {toast} from "react-toastify";
import {getErrorMessage} from "../../../utils/errorMessageUtils";
import './UserManagement.css';
import Select from "react-select";
import {useGetHackathonRolesQuery} from "../../../apis/hackathonRoleApi";
import ConfirmModalDialog from "../../common/ConfirmModalDialog";

const UserManagement = () => {
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [deleteHackathonUserData, setDeleteHackathonUserData] = useState(null); // [hackathonId, userId
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
        isLoading: createHackathonUserRoleIsLoading,
        isSuccess: createHackathonUserRoleIsSuccess,
        isError: createHackathonUserRoleIsError,
        error: createHackathonUserRoleError
    }] = useCreateHackathonUserRoleMutation()
    const [deleteHackathonUserRole, {
        isSuccess: deleteHackathonUserRoleIsSuccess,
        isError: deleteHackathonUserRoleIsError,
        error: deleteHackathonUserRoleError
    }] = useDeleteHackathonUserRoleMutation();
    const [deleteHackathonUser, {
        isError: deleteHackathonUserIsError,
        error: deleteHackathonUserError
    }] = useDeleteHackathonUserMutation();

    const {data: hackathonRoles,
    } = useGetHackathonRolesQuery(hackathonId);

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
            toast.success('Successfully updated user roles', {
                    position: toast.POSITION.TOP_CENTER
                }
            );
            closeModal();
        }
    }, [createHackathonUserRoleIsSuccess]);

    useEffect(() => {
        if (createHackathonUserRoleIsError) {
            toast.error(`Failed to update user roles: ${getErrorMessage(createHackathonUserRoleError)}`, {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    }, [createHackathonUserRoleIsError, createHackathonUserRoleError]);

    useEffect(() => {
        if (deleteHackathonUserRoleIsError) {
            toast.error(`Failed to delete user role: ${getErrorMessage(deleteHackathonUserRoleError)}`, {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    }, [deleteHackathonUserRoleError, deleteHackathonUserRoleIsError]);

    useEffect(() => {
        if (deleteHackathonUserRoleIsSuccess) {
            toast.success('Successfully deleted user role', {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    }, [deleteHackathonUserRoleIsSuccess]);

    useEffect(() => {
        if (deleteHackathonUserIsError) {
            toast.error(`Failed to delete user: ${getErrorMessage(deleteHackathonUserError)}`, {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    }, [deleteHackathonUserIsError, deleteHackathonUserIsError]);

    const handleRoleChange = async (selectedOptions, actionMeta, userId) => {
        try {
            if (actionMeta?.action === 'remove-value') {
                if (actionMeta?.removedValue?.value) {
                    const hackathonUserRoleData = {
                        hackathonId,
                        userId,
                        roleName: actionMeta.removedValue.value
                    }
                    await deleteHackathonUserRole(hackathonUserRoleData);
                }
            } else {
                const hackathonUserRoleData = {
                    hackathonId: hackathonId,
                    userId: userId,
                    hackathonRoles: selectedOptions.map(option => option.value)
                };
                await createHackathonUserRole(hackathonUserRoleData).unwrap();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getUserHackathonRoles = (user) => {
        if (!user?.hackathonRoles || !Array.isArray(user.hackathonRoles)) {
            return [];
        }
        return user.hackathonRoles.map(role => ({ label: role, value: role }));
    }

    const allHackathonRoles = () => {
        if (!hackathonRoles || !Array.isArray(hackathonRoles)) {
            return [];
        }
        return hackathonRoles.map(role => ({ label: role.name, value: role.name }));
    }

    const handleDeleteUserButtonPressed = (user) => {
        try {
            const hackathonUserData = {
                hackathonId: hackathonId,
                userId: user.id,
                email: user.email
            };
            setDeleteHackathonUserData(hackathonUserData);
            // pop up a confirmation dialog
            setShowDeleteUserModal(true);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteUser = async () => {
        setShowDeleteUserModal(false);
        await deleteHackathonUser(deleteHackathonUserData).unwrap();
    }

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
                    {createHackathonUserRoleIsLoading && <p>Adding user...</p>}
                    <div className="user-management">
                        {hackathonUsers &&
                            <Table bordered hover>
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Roles</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {hackathonUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.email}</td>
                                        <td>
                                            <Select
                                                options={allHackathonRoles()}
                                                isMulti
                                                defaultValue={getUserHackathonRoles(user)}
                                                onChange={(selectedOptions,actionMeta) => handleRoleChange(selectedOptions, actionMeta, user.id)}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => {handleDeleteUserButtonPressed(user)}}>Remove User</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
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
            <ConfirmModalDialog show={showDeleteUserModal}
                                title="Delete User"
                                message={`Are you sure you want to delete user ${deleteHackathonUserData?.email}?`}
                                onConfirm={handleDeleteUser}
                                onCancel={() => setShowDeleteUserModal(false)} />

        </div>
    )
}

export default UserManagement;