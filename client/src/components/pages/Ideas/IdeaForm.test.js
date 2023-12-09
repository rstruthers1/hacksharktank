import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IdeaForm from './IdeaForm';

describe('IdeaForm', () => {
    let submitIdea;

    beforeEach(() => {
        submitIdea = jest.fn();
        render(<IdeaForm submitIdea={submitIdea} />);
    });

    it('submits form data', async () => {
        const titleInput = screen.getByLabelText('Title');
        const descriptionInput = screen.getByLabelText('Description');
        const submitButton = screen.getByText('Submit Idea');

        fireEvent.change(titleInput, { target: { value: 'Test Title' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        fireEvent.click(submitButton);

        expect(submitIdea).toHaveBeenCalledWith({
            title: 'Test Title',
            description: 'Test Description',
        });
    });
});