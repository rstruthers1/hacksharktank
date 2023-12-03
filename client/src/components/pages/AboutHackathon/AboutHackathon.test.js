import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useGetHackathonQuery } from '../../../apis/hackathonApi';
import AboutHackathon from './AboutHackathon';
import '@testing-library/jest-dom';
import renderer from "react-test-renderer";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../../apis/hackathonApi', () => ({
    useGetHackathonQuery: jest.fn(),
}));

describe('AboutHackathon', () => {
    it('should render correctly', () => {
        useParams.mockReturnValue({ hackathonId: '1' });
        useGetHackathonQuery.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });
        const tree = renderer.create(<AboutHackathon/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly', async () => {
        useParams.mockReturnValue({ hackathonId: '1' });
        useGetHackathonQuery.mockReturnValue({
            data: {
                eventName: 'Test Hackathon',
                description: 'This is a test hackathon',
                startDate: new Date(),
                endDate: new Date(),
            },
            error: null,
            isLoading: false,
        });

        const { getByText } = render(<AboutHackathon />);

        await waitFor(() => {
            expect(getByText('Test Hackathon')).toBeInTheDocument();
            expect(getByText('This is a test hackathon')).toBeInTheDocument();
        });
    });

    it('displays loading state', () => {
        useParams.mockReturnValue({ hackathonId: '1' });
        useGetHackathonQuery.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });

        const { getByText } = render(<AboutHackathon />);

        expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('displays error state', () => {
        useParams.mockReturnValue({ hackathonId: '1' });
        useGetHackathonQuery.mockReturnValue({
            data: null,
            error: 'Error',
            isLoading: false,
        });

        const { getByText } = render(<AboutHackathon />);

        expect(getByText('Oh no, there was an error')).toBeInTheDocument();
    });
});