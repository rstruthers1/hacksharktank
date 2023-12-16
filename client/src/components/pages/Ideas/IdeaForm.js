import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useCreateHackathonIdeaMutation} from "../../../apis/hackathonIdeaApi";
import {toast} from "react-toastify";
import {getErrorMessage} from "../../../utils/errorMessageUtils";
import {getLoggedInUser} from "../../../utils/authUtils";

// Yup schema for validation
const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters').max(512, 'Description cannot exceed 512 characters'),
});

const IdeaForm = ({hackathonId}) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [createHackathonIdea] = useCreateHackathonIdeaMutation();
    const [quillContent, setQuillContent] = useState(''); // Local state to track Quill content

    const onSubmit = async data => {
        const hackathonData = {
            userId: getLoggedInUser()?.id,
            title: data.title,
            description: data.description
        };

        try {
            await createHackathonIdea({hackathonId, data: hackathonData}).unwrap();
            toast.success("Idea submitted successfully");
            reset();
            setQuillContent('');
        } catch (err) {
            toast.error(`Error submitting idea ${getErrorMessage(err)}`);
        }
    };


    // Update description length
    const handleDescriptionChange = (content) => {
        setValue('description', content);
        setQuillContent(content);
    };

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

            <Button type="submit" className="submit-btn">Submit Idea</Button>
        </Form>
    );
};

export default IdeaForm;
