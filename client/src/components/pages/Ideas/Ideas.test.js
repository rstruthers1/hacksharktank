import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { useGetHackathonIdeasQuery, useCreateHackathonIdeaMutation, useDeleteHackathonIdeaMutation } from "../../../apis/hackathonIdeaApi";
import IdeasPage from './Ideas';
import { getLoggedInUser } from "../../../utils/authUtils";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../../apis/hackathonIdeaApi', () => ({
    useGetHackathonIdeasQuery: jest.fn(),
    useCreateHackathonIdeaMutation: jest.fn(),
    useDeleteHackathonIdeaMutation: jest.fn(),
}));

jest.mock('../../../utils/authUtils', () => ({
    getLoggedInUser: jest.fn(),
}));

describe('IdeasPage', () => {
    beforeEach(() => {
        useParams.mockImplementation(() => ({ hackathonId: '1' }));
        useGetHackathonIdeasQuery.mockImplementation(() => ({
            data: [{ title: 'Idea 1', description: 'Description 1' }],
            error: null,
            isLoading: false,
        }));
        useCreateHackathonIdeaMutation.mockImplementation(() => [jest.fn()]);
        useDeleteHackathonIdeaMutation.mockImplementation(() => [jest.fn(), { error: null }]);
        getLoggedInUser.mockImplementation(() => ({ id: '1' }));
    });

    it('renders ideas', async () => {
        render(<IdeasPage />);
        await waitFor(() => screen.getByText('Idea 1'));
        expect(screen.getByText('Idea 1')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
    });
});