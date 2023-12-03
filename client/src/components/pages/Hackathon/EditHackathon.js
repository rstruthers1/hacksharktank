import React, {useEffect} from 'react';
import '../../layout/Dashboard.css';
import {useParams} from "react-router-dom";
import {useGetHackathonQuery, useUpdateHackathonMutation} from "../../../apis/hackathonApi";
import HackathonForm from "./HackathonForm";
import {toast} from "react-toastify";

const EditHackathon = () => {
    const {hackathonId} = useParams();
    const [updateHackathon, {
            isLoading: updateHackathonIsLoading,
            isSuccess: updateHackathonIsSuccess,
            isError: updateHackathonIsError,
            error: updateHackathonError
        }
    ] = useUpdateHackathonMutation();

    const {
        data: hackathon,
        error: getHackathonError,
        isLoading: getHackathonIsLoading
    } = useGetHackathonQuery(hackathonId);

    const onSubmit = async data => {
        // Handle your form submission here
        const hackathonData = {
            id: hackathonId,
            eventName: data.eventName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate
        };
        await updateHackathon(hackathonData);
    }

    useEffect(
        () => {
            if (updateHackathonIsSuccess) {
                toast.success('Hackathon updated successfully', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }, [updateHackathonIsSuccess]
    )

    useEffect(() => {
        if (updateHackathonIsError) {
            toast.error(updateHackathonError.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }, [updateHackathonIsError]);

    return (
        <div className="dashboard">
            <main className="content">
                {getHackathonError ? (
                    <>Oh no, there was an error</>
                ) : getHackathonIsLoading ? (
                    <>Loading...</>
                ) : hackathon && (
                    <div>
                        <h1>{hackathon.eventName}</h1>
                        <HackathonForm hackathon={hackathon} onSubmit={onSubmit} submitButtonLabel="Update Hackathon"/>
                        {updateHackathonIsLoading && <p>Updating...</p>}
                    </div>) }
            </main>
        </div>
    );
};

export default EditHackathon;
