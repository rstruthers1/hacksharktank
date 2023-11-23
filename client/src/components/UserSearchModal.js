import {Button, Modal} from "react-bootstrap";
import UserSearchSelect from "./UserSearchSelect";
import {useState} from "react";

const UserSearchModal = ({show, handleClose, handleSelect}) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = () => {
        handleClose();
        handleSelect(selectedUser);
    };

    const userSelected = (user) => {
        setSelectedUser(user);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add a user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UserSearchSelect onChange={userSelected} value={selectedUser}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add User
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserSearchModal;