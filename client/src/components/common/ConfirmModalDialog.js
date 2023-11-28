import {Button, Modal} from "react-bootstrap";

const ConfirmModalDialog = ({show, title, message, onConfirm, onCancel}) => {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={onConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModalDialog;