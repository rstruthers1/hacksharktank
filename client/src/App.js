import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"
import Home from "./components/pages/Home/Home"
import About from "./components/pages/About/About"
import MainMenu from "./components/layout/MainMenu/MainMenu";
import RouterErrorPage from "./routes/RouterErrorPage";
import Login from "./components/pages/Auth/Login";
import Signup from "./components/pages/Auth/SignupForm";
import {store} from "./store/store";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import CreateHackathon from "./components/pages/Hackathon/CreateHackathon";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AccessDenied from "./components/pages/Auth/AccessDenied";
import LoggedOut from "./components/pages/Auth/LoggedOut";
import {useEffect, useState} from "react";
import {useIdleTimer} from "react-idle-timer";
import {isSessionExpired, isUserLoggedIn, logoutUser} from "./utils/authUtils";
import HackathonList from "./components/pages/HackathonList/HackathonList";
import HackathonAdminDashboard from "./components/layout/HackathonAdminDashboard/HackathonAdminDashboard";
import EditHackathon from "./components/pages/Hackathon/EditHackathon";
import UserManagement from "./components/pages/UserManagement/UserManagement";
import StayLoggedInPrompt from "./components/pages/Auth/StayLoggedInPrompt";
import HackathonDashboard from "./components/layout/HackathonDashboard/HackathonDashboard";

// set timeout to 1 hour
const timeout = 3_600_000

// set prompt before idle to 1 minute
const promptBeforeIdle = 60_000


function ViewHackathon() {
    return null;
}


export function App() {
    const [stayLoggedInPromptModalOpen, setStayLoggedInPromptModalOpen] = useState(false)

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
        setStayLoggedInPromptModalOpen(false);
        if (!isUserLoggedIn()) {
            return;
        }
        logoutUser()
        window.location.href = '/logged-out';
    }


    useEffect(() => {
        const checkSessionInterval = setInterval(() => {
            // Call your session check function
            if (isSessionExpired()) {
                handleLogout();
            }
        }, 60000); // Check every minute

        // Clear the interval when the component unmounts
        return () => clearInterval(checkSessionInterval);
    }, []);


    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainMenu/>,
            errorElement: <RouterErrorPage/>,

            children: [
                {path: "", element: <Home/>},
                {path: "/about", element: <About/>},
                {path: "/login", element: <Login/>},
                {path: "/signup", element: <Signup/>},
                {path: "/access-denied", element: <AccessDenied/>},
                {path: "/logged-out", element: <LoggedOut/>},
                {path: "/dashboard/hackathon/:hackathonId", element: <HackathonDashboard/>,
                    children: [
                        {path: 'edit', element: <EditHackathon/>},
                        {path: 'view', element: <ViewHackathon/>},
                        {path: 'users', element: <UserManagement/>},
                    ]
                },
            ]
        },
        {
            element: <ProtectedRoutes onlyAdmin/>,
            children: [
                {path: "/create-hackathon", element: <CreateHackathon/>},
                {path: "/hackathons", element: <HackathonList/>},
                {
                    path: '/admin/hackathon/:hackathonId', element: <HackathonAdminDashboard/>,
                    children: [
                        {path: 'edit', element: <EditHackathon/>},
                        {path: 'users', element: <UserManagement/>},
                    ]
                }
            ]
        }

    ]);
    return (
        <Provider store={store}>
            <RouterProvider router={router}/>
            <ToastContainer/>
                <StayLoggedInPrompt
                    show={stayLoggedInPromptModalOpen && isUserLoggedIn()}
                    handleLogout={handleLogout}
                    handleStillHere={handleStillHere}
                    getRemainingTime={getRemainingTime}
                 />
        </Provider>
    );
}
