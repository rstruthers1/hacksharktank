import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

// Yup schema for validation
const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters').max(512, 'Description cannot exceed 512 characters'),
});

const IdeaForm = ({submitIdea}) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        submitIdea(data);
    };

    // Update description length
    const handleDescriptionChange = (content) => {
        setValue('description', content);
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
                 <ReactQuill theme="snow" onChange={handleDescriptionChange} id="Description"/>
                </div>
                {errors.description && <p className="text-danger">{errors.description.message}</p>}
            </Form.Group>

            <Button type="submit" className="submit-btn">Submit Idea</Button>
        </Form>
    );
};

export default IdeaForm;
