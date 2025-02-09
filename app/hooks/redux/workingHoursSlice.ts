import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getStatePersisted, saveState } from '@/app/providers/local-storage'
import { WorkingHoursSlice } from '../../types/redux'

const workingHours: WorkingHoursSlice = getStatePersisted()?.workingHours || {
  minTime: '07:00:00',
  maxTime: '18:00:00',
}

export const workingHoursSlice = createSlice({
  name: 'workingHours',
  initialState: {
    workingHours,
  },
  reducers: {
    setWorkingHours: (state, action: PayloadAction<WorkingHoursSlice>) => {
      if (action.payload?.minTime && action.payload?.maxTime) {
        const { minTime, maxTime } = action.payload

        state.workingHours = { maxTime, minTime }

        saveState({ workingHours: { maxTime, minTime } })
      }
    },
  },
})

export const { setWorkingHours } = workingHoursSlice.actions

export default workingHoursSlice.reducer



