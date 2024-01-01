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
import HackathonList from "./components/pages/HackathonList/HackathonList";
import HackathonAdminDashboard from "./components/layout/HackathonAdminDashboard/HackathonAdminDashboard";
import EditHackathon from "./components/pages/Hackathon/EditHackathon";
import UserManagement from "./components/pages/UserManagement/UserManagement";
import HackathonDashboard from "./components/layout/HackathonDashboard/HackathonDashboard";
import AboutHackathon from "./components/pages/AboutHackathon/AboutHackathon";
import Ideas from "./components/pages/Ideas/Ideas";
import UserProfile from "./components/pages/UserProfile/UserProfile";
import ChangePassword from "./components/pages/Auth/ChangePassword";


export function App() {


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
                        {path: 'about', element: <AboutHackathon/>},
                        {path: 'users', element: <UserManagement/>},
                        {path: 'ideas', element: <Ideas/>},
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
        },
        {
            element: <ProtectedRoutes onlyAdmin={false}/>,
            children: [
                {path: "/profile", element: <UserProfile/>},
                {path: "/change-password", element: <ChangePassword/>}
            ]
        }


    ]);
    return (
        <Provider store={store}>
            <RouterProvider router={router}/>
            <ToastContainer/>
        </Provider>
    );
}
