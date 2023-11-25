import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseURL = process.env.REACT_APP_API_URL || "";

export const hackathonRoleApi = createApi({
  reducerPath: 'hackathonRoleApi',
    baseQuery: fetchBaseQuery(
        {baseUrl: `${baseURL}/`}), // Set your base URL here
    endpoints: (builder) => ({
      getHackathonRoles: builder.query({
        query: () => ({
          url: `hackathon-roles`,
          method: 'GET',
          // Add a JWT token to the request headers if the user is logged in
          headers: {'Authorization': `JWT ${localStorage.getItem('token')}`},
        }),
        providesTags: (result, error, arg) => [{type: 'HackathonRoles', id: arg}],
      }),
    })

});

export const {useGetHackathonRolesQuery} = hackathonRoleApi;