import { configureStore } from '@reduxjs/toolkit'
import devSlice from '../features/dev/devSlice'
import studentSlice from '../features/student/studentSlice'

export const store = configureStore({
    reducer: {
        dev: devSlice,
        student: studentSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
