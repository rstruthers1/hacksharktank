import React from 'react';
import { useGetHackathonIdeasQuery, useCreateHackathonIdeaMutation } from "../../../apis/hackathonIdeaApi";
import 'react-quill/dist/quill.snow.css';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './Ideas.css';
import {useParams} from "react-router-dom";
import IdeaForm from "./IdeaForm";
import {getLoggedInUser} from "../../../utils/authUtils";
import {toast} from "react-toastify";
import {getErrorMessage} from "../../../utils/errorMessageUtils";

const IdeasPage = () => {

    const {hackathonId} = useParams();
    const {data: ideas, error: getHackathonIdeasError, isLoading: getHackathonIdeasIsLoading } = useGetHackathonIdeasQuery(hackathonId);
    const [createHackathonIdea] = useCreateHackathonIdeaMutation();


    const submitIdea = async (data) => {
        console.log(data);
        const hackathonData = {
            userId: getLoggedInUser()?.id,
            title: data.title,
            description: data.description
        }
        console.log(`hackathonData: ${JSON.stringify(hackathonData, null, 2)}`)
        createHackathonIdea({hackathonId, data: hackathonData}).unwrap()
            .then(() => {
                toast.success("Idea submitted successfully")
            })
            .catch((err) => {
                toast.error(`Error submitting idea ${getErrorMessage(err)}`)
            });
    };

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
                    <IdeaForm submitIdea={submitIdea}/>
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
