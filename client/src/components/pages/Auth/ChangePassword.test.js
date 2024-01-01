import React from 'react';
import {render, screen, waitFor, fireEvent, getByLabelText} from '@testing-library/react';
import '@testing-library/jest-dom'
import ChangePassword from './ChangePassword'; // Adjust the import path as needed
import { useChangePasswordMutation } from '../../../apis/userApi';
import { getLoggedInUser } from "../../../utils/authUtils";

// Mocking dependencies
jest.mock('../../../apis/userApi', () => ({
    useChangePasswordMutation: jest.fn(),
}));

jest.mock('../../../utils/authUtils', () => ({
    getLoggedInUser: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('<ChangePassword />', () => {

    beforeEach(() => {
        useChangePasswordMutation.mockReturnValue([jest.fn(), {}]);
        getLoggedInUser.mockReturnValue({ id: '123' });
    });

    it('renders the change password form', () => {
        render(<ChangePassword />);
        expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument();
    });

    it('displays an error message when old password is not provided', async () => {
        render(<ChangePassword />);
        fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));
        await waitFor(() => {
            expect(screen.getByText(/Old password is required/i)).toBeInTheDocument();
        });

    });

    // Add more test cases as needed, such as for validation errors, submission errors, etc.
});
