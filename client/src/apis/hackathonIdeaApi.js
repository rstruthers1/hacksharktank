import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = process.env.REACT_APP_API_URL || "";

export const hackathonIdeaApi = createApi({
    reducerPath: 'hackathonIdeaApi',
    baseQuery: fetchBaseQuery(
        {baseUrl: `${baseURL}/`}), // Set your base URL here
    endpoints: (builder) => ({
        getHackathonIdeas: builder.query({
            query: (hackathonId) => ({
                url: `hackathons/${hackathonId}/ideas`,
                method: 'GET',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, arg) => [{ type: 'HackathonIdeas'}],
        }),
       createHackathonIdea: builder.mutation({
                query: (hackathonIdeaData) => ({
                    url: `hackathons/${hackathonIdeaData.hackathonId}/ideas`,
                    method: 'POST',
                    body: hackathonIdeaData.data,
                    // Add a JWT token to the request headers if the user is logged in
                    headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
                }),
                invalidatesTags: (result, error, arg) => [{ type: 'HackathonIdeas'}],
            }),
        updateHackathonIdea: builder.mutation({
            query: (hackathonIdeaData) => ({
                url: `hackathons/${hackathonIdeaData.hackathonId}/ideas`,
                method: 'PUT',
                body: hackathonIdeaData.data,
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'HackathonIdeas'}],
        }),
        deleteHackathonIdea: builder.mutation({
            query: ({hackathonId, ideaId}) => ({
                url: `hackathons/${hackathonId}/ideas/${ideaId}`,
                method: 'DELETE',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'HackathonIdeas'}],
        }),
    })
});

export const {
    useGetHackathonIdeasQuery,
    useCreateHackathonIdeaMutation,
    useDeleteHackathonIdeaMutation,
    useUpdateHackathonIdeaMutation
} = hackathonIdeaApi;
