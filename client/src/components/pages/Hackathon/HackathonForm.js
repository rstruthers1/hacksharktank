import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import {getMinEndDate, getTodayAtMidnight, safeStringToDate} from "../../../utils/dateTimeUtils";
import React from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

const HackathonForm = ({onSubmit, submitButtonLabel, hackathon}) => {
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
        mode: "onChange",
        defaultValues: {
            eventName: hackathon?.eventName ? hackathon.eventName : '',
            description: hackathon?.description ? hackathon.description : '',
            startDate: safeStringToDate(hackathon?.startDate),
            endDate: safeStringToDate(hackathon?.endDate)
        }
    });

    const currentStartDate = watch('startDate');
    const currentDescription = watch('description');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formField">
                <label htmlFor="eventName">Event Name <span className="required">*</span></label>
                <input type="text" {...register('eventName')}/>
                {errors.eventName?.message && <p className="error">{errors.eventName?.message}</p>}
            </div>
            <div className="formField">
                <label htmlFor="description">Event Description <span className="required">*</span></label>
                <textarea {...register('description')} />
                <div className="note">{currentDescription ? currentDescription.length : 0}/512 characters</div>
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
            <button type="submit" className="submit-btn">{submitButtonLabel}</button>
        </form>
    )
}

export default HackathonForm;