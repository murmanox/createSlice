import { Store, combineReducers } from "@rbxts/rodux";
import { counterActions, counterReducer } from "shared/store1";
import { valueActions, valueReducer } from "shared/store2";

const reducer = combineReducers({
    counter: counterReducer,
    value: valueReducer,
})

const store = new Store(reducer)

print("Change counter")
store.dispatch(counterActions.increment())
store.dispatch(counterActions.increment())
store.dispatch(counterActions.increment())

print(store.getState().counter.value === 3)

store.dispatch(counterActions.decrement())
store.dispatch(counterActions.decrement())

print(store.getState().counter.value === 1)

store.dispatch(counterActions.incrementByAmount(10))

print(store.getState().counter.value === 11)

print("Change value")
store.dispatch(valueActions.increment())
store.dispatch(valueActions.increment())
store.dispatch(valueActions.increment())

print(store.getState().value.value === 3)

store.dispatch(valueActions.decrement())
store.dispatch(valueActions.decrement())

print(store.getState().value.value === 1)

store.dispatch(valueActions.incrementByAmount(10))

print(store.getState().value.value === 11)

store.dispatch(valueActions.reset())
print(store.getState().value.value === 0)