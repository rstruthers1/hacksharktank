// store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiService } from './apiService'; // We'll create this next

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [apiService.reducerPath]: apiService.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of `createApi`
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiService.middleware),
});
