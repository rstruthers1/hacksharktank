import React, {useEffect} from 'react';
import './CenteredForms.css';
import 'react-datepicker/dist/react-datepicker.css'
import {useCreateHackathonMutation} from "../apis/hackathonApi";
import {toast} from "react-toastify";
import HackathonForm from "./HackathonForm";

const CreateHackathon = () => {
    const [createHackathon, {isLoading, isSuccess, isError, data, error}] = useCreateHackathonMutation();

    const onSubmit = async data => {
        const hackathonData = {
            eventName: data.eventName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate
        };
        await createHackathon(hackathonData);
    }

    const renderErrorMessage = (error) => {
        if (!error?.data?.message) {
            return 'Unknown error';
        }
        if (Array.isArray(error.data.message)) {
            const errorMessages = error.data.message;
            return (
                <ul>
                    {errorMessages.map(errorMessage => {
                        return (
                            <li>{errorMessage.msg}</li>
                        );
                    })}
                </ul>
            );
        } else {
            return error.data.message;
        }
    }

    useEffect(
        () => {
            if (isSuccess) {
                toast.success('Hackathon created successfully', {
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
        }, [isSuccess]
    )

    useEffect(() => {
        if (isError) {
            toast.error(renderErrorMessage(error), {
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
    }, [isError])

    return (
        <div className="centeredForm">
            <h2>Create Hackathon Event</h2>
            <HackathonForm  onSubmit={onSubmit} submitButtonLabel="Create Hackathon"/>
            {isLoading && <p>Creating event...</p>}
        </div>
    );
};

export default CreateHackathon;
