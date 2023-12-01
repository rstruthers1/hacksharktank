import {render, screen} from '@testing-library/react';
import {useParams} from 'react-router-dom';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import UserManagement from './UserManagement';
import {
    useCreateHackathonUserRoleMutation,
    useGetHackathonQuery,
    useGetHackathonUsersQuery,
    useDeleteHackathonUserRoleMutation,
    useDeleteHackathonUserMutation,
    useGetUsersHackathonQuery
} from "../../../apis/hackathonApi";
import {useGetHackathonRolesQuery} from "../../../apis/hackathonRoleApi";
import { useLazySearchUsersQuery } from '../../../apis/userApi';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock("../../../apis/hackathonApi", () => ({
    useGetHackathonQuery: jest.fn(),
    useGetHackathonUsersQuery: jest.fn(),
    useCreateHackathonUserRoleMutation: jest.fn(),
    useDeleteHackathonUserRoleMutation: jest.fn(),
    useDeleteHackathonUserMutation: jest.fn(),
    useGetUsersHackathonQuery: jest.fn(),
}));

jest.mock("../../../apis/userApi", () => ({
    useLazySearchUsersQuery: jest.fn(),
}));

jest.mock("../../../apis/hackathonRoleApi", () => ({
    useGetHackathonRolesQuery: jest.fn(),
}));

function mockUserIsHackathonAdmin() {
    useGetUsersHackathonQuery.mockReturnValue({
        data: {
            "id": 1,
            "eventName": "Test Hackathon",
            "description": "This is a test hackathon",
            "startDate": "2023-12-05T05:00:00.000Z",
            "endDate": "2023-12-22T06:00:00.000Z",
            "hackathonUserRoles": [
                "admin",
                "participant"
            ]
        },
        error: null,
    });
}

function mockUserIsHackathonParticipant() {
    useGetUsersHackathonQuery.mockReturnValue({
        data: {
            "id": 1,
            "eventName": "Test Hackathon",
            "description": "This is a test hackathon",
            "startDate": "2023-12-05T05:00:00.000Z",
            "endDate": "2023-12-22T06:00:00.000Z",
            "hackathonUserRoles": [
                "participant"
            ]
        },
        error: null,
    });
}

describe('UserManagement', () => {
    beforeEach(() => {
        useParams.mockReturnValue({hackathonId: '1'});
        useGetHackathonQuery.mockReturnValue({
            data: {eventName: 'Test Hackathon'},
            error: null,
            isLoading: false,
        });
        useGetHackathonUsersQuery.mockReturnValue({
            data: [{id: '1', email: 'test@example.com', hackathonRoles: ['participant']}],
            error: null,
            isLoading: false,
        });
        useGetHackathonRolesQuery.mockReturnValue({
            data: [{name: 'participant'}],
        });


        useLazySearchUsersQuery.mockReturnValue([jest.fn(), {
            data: [{id: '1', email: 'foo@example.com'}],
            error: null,
            isLoading: false}]);
        useCreateHackathonUserRoleMutation.mockReturnValue([jest.fn(), {isLoading: false}]);
        useDeleteHackathonUserRoleMutation.mockReturnValue([jest.fn(), {isLoading: false}]);
        useDeleteHackathonUserMutation.mockReturnValue([jest.fn(), {isLoading: false}]);
    });

    it('renders without crashing', () => {
        mockUserIsHackathonAdmin();
        render(<UserManagement/>);
        expect(screen.getByText('Test Hackathon')).toBeInTheDocument();
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    it('renders a list of users', () => {
        mockUserIsHackathonAdmin();
        render(<UserManagement/>);
        expect(screen.getByText('Test Hackathon')).toBeInTheDocument();
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('renders a list of users for a participant', () => {
        mockUserIsHackathonParticipant();
        render(<UserManagement/>);
        expect(screen.getByText('Test Hackathon')).toBeInTheDocument();
        expect(screen.getByText('Hackathon Users')).toBeInTheDocument();

    });

    it('matches the snapshot', () => {
        mockUserIsHackathonAdmin();
        const tree = renderer.create(<UserManagement/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});