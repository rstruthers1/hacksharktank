import {Container} from "react-bootstrap";
import {useGetHackathonsQuery} from "../../../apis/hackathonApi";
import HackathonTable from "./HackathonTable";

const HackathonList = () => {
    // Get hackathons from backend
    const { data: hackathons, error, isLoading } = useGetHackathonsQuery();

    return (
        <Container>
            <h1>Hackathons</h1>
            {error ? (
                <>Oh no, there was an error</>
            ) : isLoading ? (
                <>Loading...</>
            ) : hackathons ? (
                <HackathonTable hackathons={hackathons}/>
            ) : null}
        </Container>
    )
}

export default HackathonList;