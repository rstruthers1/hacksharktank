import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useCreateHackathonIdeaMutation, useUpdateHackathonIdeaMutation} from "../../../apis/hackathonIdeaApi";
import {toast} from "react-toastify";
import {getErrorMessage} from "../../../utils/errorMessageUtils";
import {getLoggedInUser} from "../../../utils/authUtils";

// Yup schema for validation
const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters').max(512, 'Description cannot exceed 512 characters'),
});

const IdeaForm = ({hackathonId, idea, onCancel, onUpdate}) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: idea?.title ? idea.title : '',
            description: idea?.description ? idea.description : ''
        }
    });
    const [createHackathonIdea] = useCreateHackathonIdeaMutation();
    const [updateHackathonIdea, {
        isLoading: updateHackathonIdeaIsLoading,
        isSuccess: updateHackathonIdeaIsSuccess,
        isError: updateHackathonIdeaIsError,
        error: updateHackathonIdeaError
    }] = useUpdateHackathonIdeaMutation();


    const [quillContent, setQuillContent] = useState(idea?.description ? idea.description : ''); // Local state to track Quill content

    const onSubmit = async data => {
        const hackathonIdeaData = {
            userId: getLoggedInUser()?.id,
            title: data.title,
            description: data.description
        };

        if (isEditMode()) {
            try {
                hackathonIdeaData.id = idea.id;
                await updateHackathonIdea({hackathonId, data: hackathonIdeaData}).unwrap();
                toast.success("Idea updated successfully");
                reset();
                setQuillContent('');
            } catch (err) {
                toast.error(`Error updating idea ${getErrorMessage(err)}`);
            }
            onUpdate();
        } else {
            try {
                await createHackathonIdea({hackathonId, data: hackathonIdeaData}).unwrap();
                toast.success("Idea submitted successfully");
                reset();
                setQuillContent('');
            } catch (err) {
                toast.error(`Error submitting idea ${getErrorMessage(err)}`);
            }
        }
    };

    // Update description length
    const handleDescriptionChange = (content) => {
        setValue('description', content);
        setQuillContent(content);
    };

    const isEditMode = () => {
        return !!idea?.id;
    }

    const submitBtnText = isEditMode() ? 'Update Idea' : 'Submit Idea';


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="ideaTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" {...register('title')} isInvalid={!!errors.title} />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="ideaDescription">
                <Form.Label>Description</Form.Label>
                <div id="Description">
                 <ReactQuill
                     theme="snow"
                     value={quillContent}
                     onChange={handleDescriptionChange}
                     id="Description"/>
                </div>
                {errors.description && <p className="text-danger">{errors.description.message}</p>}
            </Form.Group>

            <div>

                {isEditMode() && <Button variant="secondary" className="cancel-btn" onClick={onCancel}>Cancel</Button>}
                <Button type="submit" className="submit-btn">{submitBtnText}</Button>

            </div>
        </Form>
    );
};

export default IdeaForm;
