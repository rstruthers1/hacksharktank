import React from 'react';
import { render, screen } from '@testing-library/react';
import HackathonTableBase from './HackathonTableBase';
import renderer from "react-test-renderer";
import '@testing-library/jest-dom';

describe('HackathonTableBase', () => {
    const mockHackathons = [
        { id: 1, eventName: 'Test Hackathon 1', description: 'Description 1', startDate: '2022-01-01', endDate: '2022-01-02' },
        { id: 2, eventName: 'Test Hackathon 2', description: 'Description 2', startDate: '2022-02-01', endDate: '2022-02-02' },
    ];

    const mockColumns = ['ID', 'Event Name', 'Description', 'Start Date', 'End Date'];

    const mockRenderRow = (hackathon) => (
        <tr key={hackathon.id}>
            <td>{hackathon.id}</td>
            <td>{hackathon.eventName}</td>
            <td>{hackathon.description}</td>
            <td>{hackathon.startDate}</td>
            <td>{hackathon.endDate}</td>
        </tr>
    );

    it('should render correctly', () => {
        const tree = renderer.create(<HackathonTableBase hackathons={mockHackathons} columns={mockColumns} renderRow={mockRenderRow} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        render(<HackathonTableBase hackathons={mockHackathons} columns={mockColumns} renderRow={mockRenderRow} />);
    });

    it('renders the correct number of rows', () => {
        render(<HackathonTableBase hackathons={mockHackathons} columns={mockColumns} renderRow={mockRenderRow} />);
        const rows = screen.getAllByRole('row');
        // Subtract 1 for the header row
        expect(rows.length - 1).toEqual(mockHackathons.length);
    });

    it('renders the correct data in the rows', () => {
        render(<HackathonTableBase hackathons={mockHackathons} columns={mockColumns} renderRow={mockRenderRow} />);
        const firstRow = screen.getByText('Test Hackathon 1');
        expect(firstRow).toBeInTheDocument();
    });
});