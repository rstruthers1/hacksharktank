import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import {
    useCreateHackathonUserRoleMutation,
    useGetHackathonQuery,
    useGetHackathonUsersQuery
} from "../apis/hackathonApi";
import UserSearchModal from "./UserSearchModal";
import {toast} from "react-toastify";
import {getErrorMessage} from "../utils/errorMessageUtils";
import './UserManagement.css';
import Select from "react-select";
import {useGetHackathonRolesQuery} from "../apis/hackathonRoleApi";

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
        isLoading: createHackathonUserRoleIsLoading,
        isSuccess: createHackathonUserRoleIsSuccess,
        isError: createHackathonUserRoleIsError,
        data: createHackathonUserRoleData,
        error: createHackathonUserRoleError
    }] = useCreateHackathonUserRoleMutation();
    const {data: hackathonRoles,
        error: getHackathonRolesError,
        isLoading: getHackathonRolesIsLoading
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

    const handleRoleChange = async (selectedOptions, userId) => {
        try {
            const hackathonUserRoleData = {
                hackathonId: hackathonId,
                userId: userId,
                hackathonRoles: selectedOptions.map(option => option.value)
            };
            await createHackathonUserRole(hackathonUserRoleData).unwrap();
        } catch (err) {
            console.log(err);
        }
    }

    const getUserHackathonRoles = (user) => {
        if (!user?.hackathonRoles || !Array.isArray(user.hackathonRoles)) {
            return [];
        }
        const userHackathonRoles = user.hackathonRoles.map(role => ({ label: role, value: role }));
        console.log(`userHackathonRoles: ${JSON.stringify(userHackathonRoles)}`)
        return userHackathonRoles;
    }

    const allHackathonRoles = () => {
        if (!hackathonRoles || !Array.isArray(hackathonRoles)) {
            return [];
        }
        return hackathonRoles.map(role => ({ label: role.name, value: role.name }));
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
                                                onChange={(selectedOptions) => handleRoleChange(selectedOptions, user.id)}
                                            />
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
        </div>
    )
}

export default UserManagement;