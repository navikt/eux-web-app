import { configureStore } from '@reduxjs/toolkit'
import reducers from 'reducers'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {IS_PRODUCTION} from "./constants/environment";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const store = configureStore({
  reducer: reducers,
  devTools: !IS_PRODUCTION
})

export default store
