import { configureStore } from '@reduxjs/toolkit'
import devSlice from '../features/dev/devSlice'
import global from '../features/global'
import student from '../features/student'
// import { createLogger } from 'redux-logger'

export const store = configureStore({
    reducer: {
        dev: devSlice,
        student,
        global,
    },
    // Uncomment for dataflow logging
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(createLogger()),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
