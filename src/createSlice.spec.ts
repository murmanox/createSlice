/// <reference types="@rbxts/testez/globals" />

import { Store } from "@rbxts/rodux"

import type { PayloadAction } from "./createAction"
import { createSlice } from "./createSlice"

export = () => {
	const grabASlice = () => {
		return createSlice({
			name: "counter",
			initialState: { value: 0 },
			reducers: {
				increment(state) {
					return { value: state.value + 1 }
				},
				decrement(state) {
					return { value: state.value - 1 }
				},
				incrementByAmount(state, action: PayloadAction<number>) {
					return { value: state.value + action.payload }
				},
			},
		})
	}

	let counterSlice: ReturnType<typeof grabASlice>

	describe("Creating a slice", () => {
		beforeEach(() => {
			counterSlice = grabASlice()
		})

		it("Should return a slice", () => {
			expect(createSlice({ name: "TestEZ", initialState: 1, reducers: {} })).to.be.ok()
		})

		it("Should have the correct name", () => {
			expect(counterSlice.name).to.equal("counter")
		})

		it("Should have the correct initialState", () => {
			const state = counterSlice.reducer(undefined!, {} as any)
			expect(state.value).to.equal(0)
		})

		it("Should have action creators for case reducers", () => {})
		it("Should support lazy values for initialState", () => {})
	})

	describe("Action creators", () => {
		beforeEach(() => {
			counterSlice = grabASlice()
		})

		it("Should return the correct type", () => {
			expect(counterSlice.actions.decrement().type).to.equal("counter/decrement")
		})
	})

	describe("Use with Rodux", () => {
		let store: ReturnType<typeof makeStore>
		const makeStore = () => {
			return new Store(counterSlice.reducer)
		}

		beforeEach(() => {
			counterSlice = grabASlice()
			store = makeStore()
		})

		it("Slice reducer should be compatible with Store", () => {
			expect(store.getState().value).to.equal(0)
		})

		it("Actions should be dispatched from store", () => {
			const { increment } = counterSlice.actions
			store.dispatch(increment())
			store.dispatch(increment())
			store.dispatch(increment())
			expect(store.getState().value).to.equal(3)
		})

		it("Actions should pass values to payload", () => {
			const { incrementByAmount } = counterSlice.actions

			store.dispatch(incrementByAmount(18))
			store.dispatch(incrementByAmount(4))
			expect(store.getState().value).to.equal(22)
		})
	})
}
