import {Link, Outlet, useNavigate} from "react-router-dom";
import './MainMenu.css';
import {isUserAdmin, isUserLoggedIn, logoutUser} from "../../../utils/authUtils";
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import SessionHandler from "../../pages/Auth/SessionHandler";


export default function MainMenu() {
    const navigate = useNavigate();

    const handleLogout = (ev) => {
        ev.preventDefault();
        logoutUser()
        navigate('/login');
    }

    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Hack Team Hub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/about">
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                            {isUserAdmin() &&
                                <NavDropdown title="Site Admin" id="basic-nav-dropdown">
                                    <LinkContainer to="/create-hackathon">
                                        <NavDropdown.Item>Create Hackathon</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/hackathons">
                                        <NavDropdown.Item>Hackathons</NavDropdown.Item>
                                    </LinkContainer>
                                 </NavDropdown>
                            }
                        </Nav>
                        <Nav>
                            {isUserLoggedIn() ? (
                                    <Nav.Link  onClick={handleLogout}>Log Out</Nav.Link>
                            ) : (
                                <>
                                    <LinkContainer to="/signup">
                                        <Nav.Link>Sign Up</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Login</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
                <SessionHandler/>
            </Navbar>
            <Outlet/>
        </div>
    )
}