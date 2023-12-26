import {Modal} from "react-bootstrap";
import IdeaForm from "./IdeaForm";

const EditIdeaModal = ({ idea, show, onUpdate, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>Edit Idea</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <IdeaForm hackathonId={idea.hackathonId} idea={idea}
                      onUpdate={onUpdate} onCancel={onCancel}/>
            </Modal.Body>
        </Modal>
    )
}

export default EditIdeaModal;