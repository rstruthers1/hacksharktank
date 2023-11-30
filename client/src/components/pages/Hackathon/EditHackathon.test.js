import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useGetHackathonQuery, useUpdateHackathonMutation } from '../../../apis/hackathonApi';
import { getLoggedInUser } from '../../../utils/authUtils';
import 'cross-fetch/polyfill';
import '@testing-library/jest-dom';
import EditHackathon from "./EditHackathon";

jest.mock('../../../apis/hackathonApi');
jest.mock('../../../utils/authUtils');

describe('EditHackathon', () => {
    beforeEach(() => {
        getLoggedInUser.mockReturnValue({ id: 1 });
    });

    it('renders loading state', () => {
        useGetHackathonQuery.mockReturnValue({ isLoading: true });
        useUpdateHackathonMutation.mockReturnValue([jest.fn(), { isLoading: true }]);
        render(<EditHackathon />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useGetHackathonQuery.mockReturnValue({ error: new Error() });
        useUpdateHackathonMutation.mockReturnValue([jest.fn(), { isLoading: true }]);
        render(<EditHackathon />);
        expect(screen.getByText('Oh no, there was an error')).toBeInTheDocument();
    });

    it('renders data', () => {
        const history = createMemoryHistory();
        const mockHackathon = { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02' };
        useGetHackathonQuery.mockReturnValue({ data: mockHackathon, isSuccess: true });
        useUpdateHackathonMutation.mockReturnValue([jest.fn(), { isLoading: true }]);
        render(<Router location={history.location} navigator={history}><EditHackathon /></Router>);
        expect(screen.getByText('Test Hackathon 1')).toBeInTheDocument();
    });
});