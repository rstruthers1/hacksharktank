import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker'
import './CenteredForms.css';
import 'react-datepicker/dist/react-datepicker.css'
import {getMinEndDate, getTodayAtMidnight} from "../utils/dateTimeUtils";
import {useCreateHackathonMutation} from "../apis/hackathonApi";
import {toast} from "react-toastify";


const HackathonForm = () => {
    const [createHackathon, {isLoading, isSuccess, isError, data, error}] = useCreateHackathonMutation();

    const validationSchema = Yup.object().shape({
        eventName: Yup.string().required('Event Name is required').min(3, 'Event Name must be at least 3 characters long').max(256, 'Event Name must be at most 256 characters long'),
        description: Yup.string().required('Description is required').min(3, 'Description must be at least 3 characters long').max(512, 'Description must be at most 512 characters long'),
        startDate: Yup.date().required('Start Date is required').typeError('Start Date is required').min(getTodayAtMidnight(), 'Start Date must be today or later'),
        endDate: Yup.date().required('End Date is required').typeError('End Date is required').when('startDate', (startDate, schema) => {
            if (startDate && Array.isArray(startDate) && startDate.length > 0) {
                try {
                    const startDateAsDate = new Date(startDate[0]);
                    const dayAfter = new Date(startDateAsDate.getTime() + 86400000);
                    return schema.min(dayAfter, 'End Date must be at least one day after Start Date');
                } catch (err) {
                    console.error(err);
                    return schema;
                }
            }
            return schema;
        })
    });

    // Initialize react-hook-form methods
    const {control, register, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onChange"
    });

    const currentStartDate = watch('startDate', false);
    const currentDescription = watch('description', false);

    const onSubmit = async data => {
        // Handle your form submission here
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

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="formField">
                    <label htmlFor="eventName">Event Name <span className="required">*</span></label>
                    <input type="text" {...register('eventName')}/>
                    {errors.eventName?.message && <p className="error">{errors.eventName?.message}</p>}
                </div>
                <div className="formField">
                    <label htmlFor="description">Event Description <span className="required">*</span></label>
                    <textarea {...register('description')}/>
                    <span className="note">{currentDescription ? currentDescription.length : 0}/512 characters</span>
                    {errors.description?.message && <p className="error">{errors.description?.message}</p>}
                </div>
                <div className="formField">
                    <label htmlFor="startDate">Start Date <span className="required">*</span></label>
                    <Controller
                        control={control}
                        name='startDate'
                        render={({field}) => (
                            <DatePicker
                                placeholderText='mm/dd/yyyy'
                                onChange={(date) => {
                                    field.onChange(date)
                                }}
                                selected={field.value}
                                dateFormat='MM/dd/yyyy'
                                minDate={getTodayAtMidnight()}
                            />
                        )}
                    />
                    {errors.startDate?.message && <p className="error">{errors.startDate?.message}</p>}
                </div>
                <div className="formField">
                    <label htmlFor="endDate">End Date <span className="required">*</span></label>
                    <Controller
                        control={control}
                        name='endDate'
                        render={({field}) => (
                            <DatePicker
                                placeholderText='mm/dd/yyyy'
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                dateFormat='MM/dd/yyyy'
                                minDate={getMinEndDate(currentStartDate)}
                            />
                        )}
                    />
                    {errors.endDate?.message && <p className="error">{errors.endDate?.message}</p>}
                </div>
                <p><span className="required">*</span> Indicates a required field</p>
                <button type="submit" className="submit-btn">Create Event</button>
            </form>

            {isLoading && <p>Creating event...</p>}
        </div>
    );
};

export default HackathonForm;
