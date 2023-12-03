import React from 'react';
import './AboutHackathon.css';
import {useParams} from "react-router-dom";
import {formatDateTimeAsDate} from "../../../utils/dateTimeUtils";
import {useGetHackathonQuery} from "../../../apis/hackathonApi";

const AboutHackathon = () => {
    const {hackathonId} = useParams();
    const {
        data: hackathon,
        error: getHackathonError,
        isLoading: getHackathonIsLoading
    } = useGetHackathonQuery(hackathonId);

    return (
        <div className="specific-hackathon">
            {getHackathonError ? (
                <>Oh no, there was an error</>
            ) : getHackathonIsLoading ? (
                <>Loading...</>
            ) : hackathon && (
                <>
                    <h1>{hackathon.eventName}</h1>
                <p>{hackathon.description}</p>

                <section className="event-details">
                <h2>Event Details</h2>
                <p>Start Date: {formatDateTimeAsDate(hackathon.startDate)}</p>
                <p>End Date: {formatDateTimeAsDate(hackathon.endDate)}</p>
                <p>Location: Virtual</p>

                </section>
                    </>
                )

            }
        </div>
    );
};

export default AboutHackathon;
