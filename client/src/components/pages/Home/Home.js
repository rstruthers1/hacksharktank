import {Container} from "react-bootstrap";
import UsersHackathonList from "../HackathonList/UsersHackathonList";
import {getLoggedInUser} from "../../../utils/authUtils";

const Home = () => {
    const loggedInUser = getLoggedInUser();

    return (
        <Container>
            <h1>Hackathon Junction</h1>
            {loggedInUser &&
                <>
                    <p>Welcome, {loggedInUser?.email}!</p>
                    <UsersHackathonList/>
                </>}
        </Container>
    )
}

export default Home;