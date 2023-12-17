import React, {useState} from 'react';
import {Card} from "react-bootstrap";
import { MdDelete } from 'react-icons/md';
import {getLoggedInUser} from "../../../utils/authUtils";
import ConfirmModalDialog from "../../common/ConfirmModalDialog";
import {useDeleteHackathonIdeaMutation} from "../../../apis/hackathonIdeaApi";
import {toast} from "react-toastify";

const IdeaCard = ({idea}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteHackathonIdea, {error: deleteHackathonIdeaError}] = useDeleteHackathonIdeaMutation();
    const [ideaToDelete, setIdeaToDelete] = useState(null);

    const isDeleteDisabled = () => {
        return !getLoggedInUser() || getLoggedInUser().id !== idea.userId;
    }

    const deleteIconStyle = {
        cursor: isDeleteDisabled() ? 'default' : 'pointer',
        color: isDeleteDisabled() ? '#CCCCCC' : 'black', // Grey color for disabled state
        float: 'right'
    };

    const deleteConfirmed = async () => {
        // call api to delete the idea
        await deleteHackathonIdea({hackathonId: idea.hackathonId, ideaId: idea.id}).unwrap()
            .then(() => {
                toast.success(`Successfully deleted idea "${ideaToDelete?.title}"`, {
                        position: toast.POSITION.TOP_CENTER
                    }
                );
            })
            .catch((err) => {
                toast.error(`Error deleting idea "${ideaToDelete?.title}"`, {
                        position: toast.POSITION.TOP_CENTER
                    }
                );
            });
    }

    const handleDeleteClicked = (ev) => {
        ev.preventDefault();
        if (isDeleteDisabled()) return;
        setIdeaToDelete({...idea})
        setShowDeleteModal(true);
    }

    return (
        <>
        <Card className="mb-3">
            <Card.Header>
                {idea.title}
                <MdDelete
                    style={deleteIconStyle}
                    onClick={handleDeleteClicked}
                    data-testid="delete-icon"
                />

            </Card.Header>
            <Card.Body>
                <Card.Text dangerouslySetInnerHTML={{ __html: idea.description }} />
            </Card.Body>
        </Card>
            <ConfirmModalDialog
                show={showDeleteModal}
                title="Delete Idea"
                message={`Are you sure you want to delete this idea: "${idea.title}?"`}
                onConfirm={() => {
                    setShowDeleteModal(false);
                    deleteConfirmed()
                }}
                confirmLabel='Delete'
                onCancel={() => setShowDeleteModal(false)}/>
            </>
    );
}

export default IdeaCard;