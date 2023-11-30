import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersHackathonList from './UsersHackathonList';
import { useGetUsersHackathonsQuery } from '../../../apis/hackathonApi';
import { getLoggedInUser } from '../../../utils/authUtils';
import {createMemoryHistory} from "history";
import {Router} from "react-router-dom";
import renderer from "react-test-renderer";
import '@testing-library/jest-dom';

jest.mock('../../../apis/hackathonApi');
jest.mock('../../../utils/authUtils');

describe('UsersHackathonList', () => {
    beforeEach(() => {
        getLoggedInUser.mockReturnValue({ id: 1 });
    });

    it('renders correctly', () => {
        const history = createMemoryHistory();
        const mockHackathons = [
            { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02', hackathonUserRoles: ['Role 1', 'Role 2'] },
            { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02', hackathonUserRoles: ['Role 1', 'Role 2'] },
        ];
        useGetUsersHackathonsQuery.mockReturnValue({ data: mockHackathons, isSuccess: true });
        const tree = renderer.create(<Router location={history.location} navigator={history}><UsersHackathonList /></Router>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders loading state', () => {
        useGetUsersHackathonsQuery.mockReturnValue({ isLoading: true });
        render(<UsersHackathonList />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useGetUsersHackathonsQuery.mockReturnValue({ error: new Error() });
        render(<UsersHackathonList />);
        expect(screen.getByText('Oh no, there was an error')).toBeInTheDocument();
    });

    it('renders data', () => {
        const history = createMemoryHistory();
        const mockHackathons = [
            { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02', hackathonUserRoles: ['Role 1', 'Role 2'] },
            { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02', hackathonUserRoles: ['Role 1', 'Role 2'] },
        ];
        useGetUsersHackathonsQuery.mockReturnValue({ data: mockHackathons, isSuccess: true });
        render(<Router location={history.location} navigator={history}><UsersHackathonList /></Router>);
        expect(screen.getByText('Hackathons that you are participating in:')).toBeInTheDocument();
    });
});