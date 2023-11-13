import {NavLink, Outlet} from "react-router-dom";
import './Menu.css';

export default function Root() {
    return (
        <div>
        <nav className="topMenu">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            <div className="loginLink">
                <NavLink to="/signup" className={({ isActive }) => isActive ? 'active' : ''}>Sign Up</NavLink>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}