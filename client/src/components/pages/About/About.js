import {Container} from "react-bootstrap";
import hackathonJunction from "../../../assets/images/hackathon-junction.png";

const About = () => {
    return (
        <Container>
            <h1>About</h1>
            <img src={hackathonJunction} alt="Hackathon Junction" width="500px"/>
        </Container>
    )
}

export default About;