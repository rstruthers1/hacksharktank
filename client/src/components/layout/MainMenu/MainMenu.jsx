import React, {forwardRef} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import './MainMenu.css';
import {isUserAdmin, isUserLoggedIn, logoutUser} from "../../../utils/authUtils";
import {Navbar, Nav, NavDropdown, Container, Dropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import SessionHandler from "../../pages/Auth/SessionHandler";
import ProfileIcon from "../../pages/UserProfile/ProfileIcon";


export default function MainMenu() {
    const navigate = useNavigate();

    const handleLogout = (ev) => {
        ev.preventDefault();
        logoutUser()
        navigate('/login');
    }

    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <ProfileIcon/>
            {children}

        </a>
    ));

    const CustomMenu = forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <ul className="list-unstyled">
                        {React.Children.toArray(children)}
                    </ul>
                </div>
            );
        },
    );

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
                                <>
                                    <Dropdown>
                                        {/*Got this from https://react-bootstrap.github.io/docs/components/dropdowns/#custom-dropdown-components*/}
                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"/>
                                        <Dropdown.Menu as={CustomMenu} className="custom-dropdown-menu">
                                            <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                            <Dropdown.Item  onClick={handleLogout}>Log Out</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
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