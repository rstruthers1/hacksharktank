import {Link, Outlet} from "react-router-dom";

export default function Root() {
    return (
        <div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <Link to="/">Home</Link> | {' '}
                    <Link to="/about">About</Link>
                </div>
                <div>
                    <Link to="/signup">Signup</Link> | {' '}
                    <Link to="/login">Login</Link>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}