import React from 'react';
import './HackathonAdminDashboard.css';
import {useParams} from "react-router-dom";
import {useGetHackathonQuery} from "../apis/hackathonApi";

const EditHackathonForm = () => {
    const { hackathonId } = useParams();

    const {data: hackathon, error, isLoading} = useGetHackathonQuery(hackathonId);

    return (
        <div className="admin-dashboard">
            <main className="content">
                {error ? (
                    <>Oh no, there was an error</>
                ) : isLoading ? (
                    <>Loading...</>
                ) : hackathon ? (
                    <div>
                        <h1>{hackathon.eventName}</h1>
                        <form>
                            <label className="form-label" htmlFor="hackathonName">Hackathon Name</label>
                            <input className="form-control" id="hackathonName" type="text" />

                            {/* Other form fields with labels */}

                            <button className="button" type="submit">Save Changes</button>
                        </form>
                    </div>): null}
            </main>
        </div>
    );
};

export default EditHackathonForm;
