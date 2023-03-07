import { configureStore } from '@reduxjs/toolkit'
import devSlice from '../features/dev/devSlice'

export const store = configureStore({
    reducer: {
        dev: devSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
