import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker'
import './CenteredForms.css';
import 'react-datepicker/dist/react-datepicker.css'
import {getTodayAtMidnight} from "../utils/dateTimeUtils";


const HackathonForm = () => {

    const validationSchema = Yup.object().shape({
        eventName: Yup.string().required('Event Name is required').min(3, 'Event Name must be at least 3 characters long'),
        startDate: Yup.date().required('Start Date is required').typeError('Start Date is required').min(getTodayAtMidnight(), 'Start Date must be today or later'),
        endDate: Yup.date().required('End Date is required').typeError('End Date is required').min(Yup.ref('startDate'), 'End Date must be after Start Date')
    });

    // Initialize react-hook-form methods
    const {control, register, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onChange"
    });

    const currentStartDate = watch('startDate', false);

    const onSubmit = async data => {
        // Handle your form submission here
        console.log(data);
    }

    return (
        <div className="centeredForm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Create Hackathon Event</h2>
                <div className="formField">
                    <label htmlFor="eventName">Event Name</label>
                    <input type="text" {...register('eventName')}/>
                    <p className="error">{errors.eventName?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="startDate">Start Date</label>
                    <Controller
                        control={control}
                        name='startDate'
                        render={({ field }) => (
                            <DatePicker
                                placeholderText='MM/dd/yyyy'
                                onChange={(date) => {field.onChange(date)}}
                                selected={field.value}
                                dateFormat='MM/dd/yyyy'
                                minDate={getTodayAtMidnight()}
                            />
                        )}
                    />
                    <p className="error">{errors.startDate?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="endDate">End Date</label>
                    <Controller
                        control={control}
                        name='endDate'
                        render={({ field }) => (
                            <DatePicker
                                placeholderText='MM/dd/yyyy'
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                dateFormat='MM/dd/yyyy'
                                minDate={currentStartDate ? currentStartDate : getTodayAtMidnight()}
                            />
                        )}
                    />
                    <p className="error">{errors.endDate?.message}</p>
                </div>
                <button type="submit" className="submit-btn">Create Event</button>
            </form>
        </div>
    );
};

export default HackathonForm;
