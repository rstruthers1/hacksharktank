import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IdeaCard from './IdeaCard'; // Adjust the import path as necessary
import { getLoggedInUser } from '../../../utils/authUtils';
import renderer from "react-test-renderer"; // Adjust the import path as necessary

// Mocking necessary modules and functions
jest.mock('../../../utils/authUtils');
jest.mock('../../../apis/hackathonIdeaApi', () => ({
    useDeleteHackathonIdeaMutation: () => [jest.fn(), {error: null}]
}));
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        POSITION: {
            TOP_CENTER: 'top-center'
        }
    }
}));

describe('IdeaCard Component', () => {
    const ideaMock = {
        id: '1',
        title: 'Test Idea',
        description: '<p>Test Description</p>',
        userId: 'user123',
        hackathonId: 'hackathon1'
    };

    beforeEach(() => {
        // Setup or reset the mocks before each test
        getLoggedInUser.mockReturnValue({ id: 'user123' }); // Mock the logged in user
    });

    it('should render correctly', () => {
        const tree = renderer.create(<IdeaCard idea={ideaMock}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders the component correctly', () => {
        render(<IdeaCard idea={ideaMock} />);
        expect(screen.getByText('Test Idea')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('shows delete icon with correct style for authorized user', () => {
        render(<IdeaCard idea={ideaMock} />);
        const deleteIcon = screen.getByTestId('delete-icon'); // Add data-testid="delete-icon" to MdDelete in your component
        expect(deleteIcon).toBeInTheDocument();
        expect(deleteIcon).toHaveStyle('cursor: pointer');
    });

    it('delete icon click opens confirmation modal', () => {
        render(<IdeaCard idea={ideaMock} />);
        const deleteIcon = screen.getByTestId('delete-icon');
        fireEvent.click(deleteIcon);
        expect(screen.getByText(/Are you sure you want to delete this idea/i)).toBeInTheDocument();
    });

    // Add more tests as needed, like for modal confirmation, cancellation, disabled delete icon, etc.
});
