import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import Home from "./components/Home"
// ...
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

export function App() {


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
            ]
        },
        {element: <ProtectedRoutes onlyAdmin/>,
            children: [
                {path: "/create-hackathon", element: <HackathonForm/>}
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
