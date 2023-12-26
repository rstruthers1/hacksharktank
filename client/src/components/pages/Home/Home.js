import {Container} from "react-bootstrap";
import UsersHackathonList from "../HackathonList/UsersHackathonList";
import {getLoggedInUser, isUserLoggedIn} from "../../../utils/authUtils";

const Home = () => {
    const loggedInUser = getLoggedInUser();

    return (
        <Container>
            <h1>Hack Team Hub</h1>
            {isUserLoggedIn() && loggedInUser &&
                <>
                    <p>Welcome, {loggedInUser?.email}!</p>
                    <UsersHackathonList/>
                </>}
        </Container>
    )
}

export default Home;