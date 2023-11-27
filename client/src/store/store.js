// store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import {hackathonApi} from "../apis/hackathonApi";
import {hackathonRoleApi} from "../apis/hackathonRoleApi";

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [userApi.reducerPath]: userApi.reducer,
        [hackathonApi.reducerPath]: hackathonApi.reducer,
        [hackathonRoleApi.reducerPath]: hackathonRoleApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of `createApi`
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(hackathonApi.middleware)
            .concat(hackathonRoleApi.middleware),
});
