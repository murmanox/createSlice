import { PayloadAction, createSlice } from "@rbxts/create-slice";

const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
        increment(state) {
            return { value: state.value + 1 }
        },
        decrement(state) {
            return { value: state.value - 1 }
        },
        incrementByAmount(state, action: PayloadAction<number>) {
            return {value: state.value + action.payload}
        }
    }
})

export const { actions: counterActions, reducer: counterReducer } = counterSlice
export default counterSlice
