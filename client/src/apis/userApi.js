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
        getUser: builder.query({
            query: (userId) => ({
                url: `users/${userId}`,
                method: 'GET',
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
        }),
        updateUser: builder.mutation({
            query: (userData) => ({
                url: `users/${userData.id}`,
                method: 'PUT',
                body: userData,
                // Add a JWT token to the request headers if the user is logged in
                headers: { 'Authorization': `JWT ${localStorage.getItem('token')}` },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
        }),
        // You can add more endpoints here
    }),
});

// Export the auto-generated hook for the `registerUser` and `loginUser` mutation
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLazySearchUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation
} = userApi;
