import React from 'react';
import { render, screen } from '@testing-library/react';
import HackathonList from './HackathonList';
import { useGetHackathonsQuery } from '../../../apis/hackathonApi';
import {createMemoryHistory} from "history";
import {Router} from "react-router-dom";
import renderer from "react-test-renderer";
import 'cross-fetch/polyfill';
import '@testing-library/jest-dom';

jest.mock('../../../apis/hackathonApi');

describe('HackathonList', () => {

    it('renders correctly', () => {
        const history = createMemoryHistory();
        const mockHackathons = [
            { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02' },
            { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02' },
        ];
        useGetHackathonsQuery.mockReturnValue({ data: mockHackathons, isSuccess: true });
        const tree = renderer.create(<Router location={history.location} navigator={history}><HackathonList /></Router>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders loading state', () => {
        useGetHackathonsQuery.mockReturnValue({ isLoading: true });
        render(<HackathonList />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useGetHackathonsQuery.mockReturnValue({ error: new Error() });
        render(<HackathonList />);
        expect(screen.getByText('Oh no, there was an error')).toBeInTheDocument();
    });

    it('renders data', () => {
        const history = createMemoryHistory();
        const mockHackathons = [
            { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02' },
            { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02' },
        ];
        useGetHackathonsQuery.mockReturnValue({ data: mockHackathons, isSuccess: true });
        render(<Router location={history.location} navigator={history}><HackathonList /></Router>);
        expect(screen.getByText('Hackathons')).toBeInTheDocument();
    });
});