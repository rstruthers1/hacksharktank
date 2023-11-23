// userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = process.env.REACT_APP_API_URL || "";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery(
        { baseUrl: `${baseURL}/` }), // Set your base URL here
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: 'users',
                method: 'POST',
                body: userData,
            }),
        }),
        loginUser: builder.mutation({
            query: (userData) => ({
                url: 'users/login',
                method: 'POST',
                body: userData,
            }),
        }),
        searchUsers: builder.query({
            query: (searchTerm) => ({
                url: `users/search?searchTerm=${searchTerm}`,
                method: 'GET',
            }),
        }),
        // You can add more endpoints here
    }),
});

// Export the auto-generated hook for the `registerUser` and `loginUser` mutation
export const { useRegisterUserMutation, useLoginUserMutation, useLazySearchUsersQuery } = userApi;
