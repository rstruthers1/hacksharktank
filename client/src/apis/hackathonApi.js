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
        // You can add more endpoints here
    }),
});



// Export the auto-generated hook for the `createHackathon` mutation
export const { useCreateHackathonMutation } = hackathonApi;
