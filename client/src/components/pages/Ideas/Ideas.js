import React from 'react';
import { useGetHackathonIdeasQuery} from "../../../apis/hackathonIdeaApi";
import 'react-quill/dist/quill.snow.css';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './Ideas.css';
import {useParams} from "react-router-dom";
import IdeaForm from "./IdeaForm";


const IdeasPage = () => {

    const {hackathonId} = useParams();
    const {data: ideas, error: getHackathonIdeasError, isLoading: getHackathonIdeasIsLoading } = useGetHackathonIdeasQuery(hackathonId);

    const renderIdeasList = () => {
        if (!ideas || !Array.isArray(ideas)) return null;
        return ideas.map((idea, index) => (
            <Card key={index} className="mb-3">
                <Card.Body>
                    <Card.Title>{idea.title}</Card.Title>
                    <Card.Text dangerouslySetInnerHTML={{ __html: idea.description }} />
                </Card.Body>
            </Card>
        ));
    };

    return (
        <Container>
            <Row>
                <Col md={{ span: 8, offset: 1 }}>
                    <IdeaForm hackathonId={hackathonId}/>
                    <hr />
                    {getHackathonIdeasIsLoading
                        ? <p>Loading...</p>
                        : getHackathonIdeasError
                            ? <p>Oh no, there was an error</p>
                            : renderIdeasList()}
                </Col>
            </Row>
        </Container>
    );
};

export default IdeasPage;
