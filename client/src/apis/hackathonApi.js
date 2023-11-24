// hackathonApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = process.env.REACT_APP_API_URL || "";

export const hackathonApi = createApi({
    reducerPath: 'hackathonApi',
    baseQuery: fetchBaseQuery(
        {baseUrl: `${baseURL}/`}), // Set your base URL here
    endpoints: (builder) => ({
        createHackathon: builder.mutation({
            query: (hackathonData) => ({
                url: 'hackathons', // Your endpoint path
                method: 'POST',
                body: hackathonData,
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
        }),
        updateHackathon: builder.mutation({
            query: (hackathonData) => ({
                url: `hackathons/${hackathonData.id}`, // Your endpoint path
                method: 'PUT',
                body: hackathonData,
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Hackathons'},
                { type: 'Hackathon', id: arg.id }],
        }),
        getHackathons: builder.query({
            query: () => ({
                url: 'hackathons', // Your endpoint path
                method: 'GET',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, arg) => [{ type: 'Hackathons'}],
        }),
        createHackathonUserRole: builder.mutation({
            query: (hackathonUserRoleData) => ({
                url: 'hackathons/users/roles', // Your endpoint path
                method: 'POST',
                body: hackathonUserRoleData,
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'HackathonUsers', id: arg.hackathonId }],
        }),
        getHackathon: builder.query({
            query: (hackathonId) => ({
                url: `hackathons/${hackathonId}`, // Your endpoint path
                method: 'GET',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, arg) => [{ type: 'Hackathon', id: arg }],
        }),
        getHackathonUsers: builder.query({
            query: (hackathonId) => ({
                url: `hackathons/${hackathonId}/users`, // Your endpoint path
                method: 'GET',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, arg) => [{ type: 'HackathonUsers', id: arg }],
        }),
        // You can add more endpoints here
    }),
});

export const {
    useCreateHackathonMutation,
    useUpdateHackathonMutation,
    useGetHackathonsQuery,
    useCreateHackathonUserRoleMutation,
    useGetHackathonQuery,
    useGetHackathonUsersQuery
} = hackathonApi;
