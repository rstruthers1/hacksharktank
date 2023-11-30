import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import HackathonTable from './HackathonTable';
import renderer from "react-test-renderer";

describe('HackathonTable', () => {
    const mockHackathons = [
        { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02' },
        { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02' },
    ];

    it('should render correctly', () => {
        const history = createMemoryHistory();
        const tree = renderer.create(<Router location={history.location} navigator={history}><HackathonTable hackathons={mockHackathons} /></Router>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const history = createMemoryHistory();
        render(<Router location={history.location} navigator={history}><HackathonTable hackathons={mockHackathons} /></Router>);
    });

    it('renders table with correct number of rows', () => {
        const history = createMemoryHistory();
        render(<Router location={history.location} navigator={history}><HackathonTable hackathons={mockHackathons} /></Router>);
        const tableRows = screen.getAllByRole('row');
        expect(tableRows.length).toBe(3);
    });

    it('renders table with correct number of columns', () => {
        const history = createMemoryHistory();
        render(<Router location={history.location} navigator={history}><HackathonTable hackathons={mockHackathons} /></Router>);
        const tableRows = screen.getAllByRole('row');
        expect(tableRows[0].children.length).toBe(5);
    });

    it('renders table with correct column headers', () => {
        const history = createMemoryHistory();
        render(<Router location={history.location} navigator={history}><HackathonTable hackathons={mockHackathons} /></Router>);
        const tableHeaders = screen.getAllByRole('columnheader');
        expect(tableHeaders[0].innerHTML).toBe('ID');
        expect(tableHeaders[1].innerHTML).toBe('Event Name');
        expect(tableHeaders[2].innerHTML).toBe('Description');
        expect(tableHeaders[3].innerHTML).toBe('Start Date');
        expect(tableHeaders[4].innerHTML).toBe('End Date');
    });
});