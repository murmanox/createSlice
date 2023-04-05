import { createSlice } from "@rbxts/create-slice";
import counterSlice from "./store1";

const valueSlice = createSlice({
    name: 'value',
    initialState: { value: 0 },
    reducers: {
        increment: counterSlice.caseReducers.increment,
        decrement: counterSlice.caseReducers.decrement,
        incrementByAmount: counterSlice.caseReducers.incrementByAmount,
        reset: () => ({ value: 0 })
    }
})

export const { actions: valueActions, reducer: valueReducer } = valueSlice
export default valueSlice