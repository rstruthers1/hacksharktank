import {Alert, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import UsersHackathonList from "../HackathonList/UsersHackathonList";
import {getLoggedInUser, isUserLoggedIn} from "../../../utils/authUtils";
import {Link} from "react-router-dom";

const Home = () => {
    const loggedInUser = getLoggedInUser();

    return (
        <Container>
            <h1>Hack Team Hub</h1>
            <Alert variant="info">
                <b>Note:</b> This platform is currently a coding exercise and not open for actual business. All features and functionalities are demonstrations for development purposes.
            </Alert>
            {isUserLoggedIn() && loggedInUser ? (
                <>
                    <p>Welcome, {loggedInUser?.email}!</p>
                    <UsersHackathonList/>
                </>
            ) : (
                <>

                    <p>Welcome to Hack Team Hub, the platform for hackathon enthusiasts to share ideas and form teams!</p>

                    <h2>How It Works</h2>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Header>Get Started</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>1. <strong>Sign Up or Log In</strong>: Create your account or log in to join our community of innovative hackers and creators.</ListGroup.Item>
                                    <ListGroup.Item>2. <strong>Receive Invitations</strong>: Hackathons on our platform are invite-only. Keep an eye on your inbox for exclusive invitations to participate in a variety of hackathons.</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Header>Engage and Collaborate</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>3. <strong>Join a Team</strong>: Once invited, you can join an existing team or form a new one. Collaborate with like-minded individuals to bring your ideas to life.</ListGroup.Item>
                                    <ListGroup.Item>4. <strong>Work on Projects</strong>: Dive into coding, designing, and innovating. Develop solutions and prototypes as a team, leveraging each member's unique skills.</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Header>Showcase and Grow</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>5. <strong>Showcase Your Project</strong>: Present your team's project within the hackathon. Get feedback and recognition from peers and industry leaders.</ListGroup.Item>
                                    <ListGroup.Item>6. <strong>Expand Your Network</strong>: Connect with other participants, mentors, and professionals. Use each hackathon as an opportunity to grow your network and skills.</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <p className="mt-4">
                        Ready to join the exclusive world of Hack Team Hub? Sign up, stay tuned for your invitations, and embark on a unique hackathon journey!
                    </p>

                    <div className="mt-4">
                        <Link to="/signup">
                            <Button variant="primary">Sign Up</Button>
                        </Link>
                        {' '}
                        <Link to="/login">
                            <Button variant="secondary">Login</Button>
                        </Link>
                    </div>
                </>
            )}
        </Container>
    )
}

export default Home;