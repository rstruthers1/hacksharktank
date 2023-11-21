import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"
import Home from "./components/Home"
import About from "./components/About"
import Root from "./routes/root";
import RouterErrorPage from "./RouterErrorPage";
import Login from "./components/Login";
import Signup from "./components/SignupForm";
import {store} from "./store";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import HackathonForm from "./components/HackathonForm";
import ProtectedRoutes from "./ProtectedRoutes";
import AccessDenied from "./components/AccessDenied";
import LoggedOut from "./components/LoggedOut";
import {useEffect} from "react";
import {isSessionExpired, logoutUser} from "./utils/authUtils";
import HackathonList from "./components/HackathonList";

export function App() {
    useEffect(() => {
        const checkSessionInterval = setInterval(() => {
            // Call your session check function
            if (isSessionExpired()) {
                // Handle session expiry (e.g., logout the user, show a message, etc.)
                logoutUser()
                // navigate to /logged-out
                window.location.href = '/logged-out';
            }
        }, 60000); // Check every minute

        // Clear the interval when the component unmounts
        return () => clearInterval(checkSessionInterval);
    }, []);


    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root/>,
            errorElement: <RouterErrorPage/>,

            children: [
                { path: "", element: <Home/> },
                { path: "/about", element: <About/> },
                { path: "/login", element: <Login/> },
                { path: "/signup", element: <Signup/> },
                { path: "/access-denied", element: <AccessDenied/> },
                {path: "/logged-out", element: <LoggedOut/>},
            ]
        },
        {element: <ProtectedRoutes onlyAdmin/>,
            children: [
                {path: "/create-hackathon", element: <HackathonForm/>},
                {path: "/hackathons", element: <HackathonList/>},
            ]
        }

    ]);
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
            <ToastContainer />
        </Provider>
    );
}
