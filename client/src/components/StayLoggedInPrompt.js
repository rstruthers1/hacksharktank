import {Button, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";

const StayLoggedInPrompt = ({show, getRemainingTime, handleLogout, handleStillHere}) => {
    const [remainingTime, setRemainingTime] = useState(getRemainingTime());
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(Math.trunc(getRemainingTime() / 1000)); // convert to whole seconds
        }, 1000);
        return () => clearInterval(interval);
    }, [getRemainingTime]);

    return (<Modal show={show} onHide={handleStillHere}>
        <Modal.Header closeButton>
            <Modal.Title>Are you still there?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>You will be logged out in {remainingTime} seconds</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleLogout}>
                Log Out
            </Button>
            <Button variant="primary" onClick={handleStillHere}>
                Stay Logged In
            </Button>
        </Modal.Footer>
    </Modal>)

}

export default StayLoggedInPrompt;
