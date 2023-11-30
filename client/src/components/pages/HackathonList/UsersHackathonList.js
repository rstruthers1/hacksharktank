import {Container} from "react-bootstrap";
import {useGetUsersHackathonsQuery} from "../../../apis/hackathonApi";
import {getLoggedInUser} from "../../../utils/authUtils";
import UsersHackathonTable from "./UsersHackathonTable";

const UsersHackathonList = () => {
    // Get hackathons from backend
    const {data: hackathons, error, isLoading} = useGetUsersHackathonsQuery(getLoggedInUser().id);

    return (
        <>
            <p>Hackathons that you are participating in:</p>
            <Container>
                {error ? (
                    <>Oh no, there was an error</>
                ) : isLoading ? (
                    <>Loading...</>
                ) : hackathons ? (
                    <UsersHackathonTable hackathons={hackathons}/>
                ) : null}
            </Container>
        </>
    )
}

export default UsersHackathonList;