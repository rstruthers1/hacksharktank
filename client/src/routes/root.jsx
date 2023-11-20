import {Link, NavLink, Outlet, useNavigate} from "react-router-dom";
import './Menu.css';
import {isUserAdmin, isUserLoggedIn, logoutUser} from "../utils/authUtils";

export default function Root() {

    const navigate = useNavigate();

    const handleLogout = (ev) => {
        ev.preventDefault();
        logoutUser()
        navigate('/login');
    }


    return (
        <div>
            <nav className="topMenu">
                <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
                <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink>
                {isUserAdmin() && <NavLink to="/create-hackathon" className={({isActive}) => isActive ? 'active' : ''}>Create Hackathon</NavLink>}
                <div className="rightMenuItemLink">
                    {isUserLoggedIn() ?
                        <Link onClick={handleLogout}>Logout</Link> :
                        <>
                            <NavLink to="/signup" className={({isActive}) => isActive ? 'active' : ''}>Sign Up</NavLink>
                            <NavLink to="/login"  className={({isActive}) => isActive ? 'active' : ''}>Login</NavLink>
                        </>
                    }
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}