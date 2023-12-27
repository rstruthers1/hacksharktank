import {useEffect, useState} from "react";
import {getLoggedInUser, isSessionExpired, isUserLoggedIn, logoutUser} from "../../../utils/authUtils";
import {useIdleTimer} from "react-idle-timer";
import {useNavigate} from "react-router-dom";
import StayLoggedInPrompt from "./StayLoggedInPrompt";

// set timeout to 1 hour
const timeout = 3_600_000;
// set prompt before idle to 1 minute
const promptBeforeIdle = 60_000;

const SessionHandler = () => {
    const [stayLoggedInPromptModalOpen, setStayLoggedInPromptModalOpen] = useState(false)
    const navigate = useNavigate();

    const onIdle = () => {
        if (isUserLoggedIn()) {
            handleLogout();
        }
    }

    const onActive = () => {
        console.log('User is active');
    }

    const onPrompt = () => {
        setStayLoggedInPromptModalOpen(true)
    }


    const { getRemainingTime, activate } = useIdleTimer({
        onIdle,
        onActive,
        onPrompt,
        timeout,
        promptBeforeIdle,
        throttle: 500
    })

    const handleStillHere = () => {
        setStayLoggedInPromptModalOpen(false);
        activate()
    }

    const handleLogout = () => {
        setStayLoggedInPromptModalOpen(true);
        const loggedInUser = getLoggedInUser()
        if (!loggedInUser) {
            return;
        }

        logoutUser();
        navigate('/logged-out')
    }

    useEffect(() => {
        const checkSessionInterval = setInterval(() => {
            // Call your session check function

            if (isSessionExpired()) {
                handleLogout();
            }
        }, 60_000); // Check every minute

        // Clear the interval when the component unmounts
        return () => clearInterval(checkSessionInterval);
    }, []);


    return (
        <StayLoggedInPrompt
            show={stayLoggedInPromptModalOpen && isUserLoggedIn()}
            handleLogout={handleLogout}
            handleStillHere={handleStillHere}
            getRemainingTime={getRemainingTime}
        />
    )
}

export default SessionHandler;