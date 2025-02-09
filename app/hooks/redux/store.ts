import { configureStore } from '@reduxjs/toolkit'
import workingHoursSlice from './workingHoursSlice'
import userSlice from './UserSlice';

const store = configureStore({
  reducer: {
    workingHoursSlice,
    user: userSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
