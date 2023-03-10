import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import devSlice from '../features/dev/devSlice'
import student from '../features/student'

export const store = configureStore({
    reducer: {
        dev: devSlice,
        student,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createLogger()),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
