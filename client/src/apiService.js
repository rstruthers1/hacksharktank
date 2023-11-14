// apiService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = process.env.REACT_APP_API_URL || "";

export const apiService = createApi({
    reducerPath: 'apiService',
    baseQuery: fetchBaseQuery(
        { baseUrl: `${baseURL}/` }), // Set your base URL here
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: 'users', // Your endpoint path
                method: 'POST',
                body: userData,
            }),
        }),
        // You can add more endpoints here
    }),
});

// Export the auto-generated hook for the `registerUser` mutation
export const { useRegisterUserMutation } = apiService;
