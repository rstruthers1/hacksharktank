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
    useDeleteHackathonUserMutation
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
}));

jest.mock("../../../apis/userApi", () => ({
    useLazySearchUsersQuery: jest.fn(),
}));

jest.mock("../../../apis/hackathonRoleApi", () => ({
    useGetHackathonRolesQuery: jest.fn(),
}));

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
        render(<UserManagement/>);
        expect(screen.getByText('Test Hackathon')).toBeInTheDocument();
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    it('renders a list of users', () => {
        render(<UserManagement/>);
        expect(screen.getByText('Test Hackathon')).toBeInTheDocument();
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('matches the snapshot', () => {
        const tree = renderer.create(<UserManagement/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});