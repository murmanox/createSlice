<h1 align="center">
	<b>createSlice</b>
</h1>

<p align="center">
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome" />
  </a>
  <a href="https://www.npmjs.com/package/@rbxts/create-slice">
    <img src="https://img.shields.io/npm/v/@rbxts/create-slice.svg?style=flat&logo=npm" />
  </a>
  <a href="https://www.npmjs.com/package/@rbxts/create-slice">
    <img src="https://img.shields.io/npm/dt/@rbxts/create-slice.svg?style=flat&logo=npm" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  </a>

createSlice is a helper function to simplify Rodux reducer creation.

&nbsp;

## Installation
This package is only available for Roblox TypeScript on NPM:

```
npm install @rbxts/create-slice
```

```
pnpm add @rbxts/create-slice
```

&nbsp;

## Documentation
createSlice is heavily based on the redux-toolkit's [createSlice](https://redux-toolkit.js.org/api/createSlice).

> **Warning**
> There are two main differences that you should be aware of:
> 
> Currently, this package does not utilize an immutable library, such as Immer, to pass drafts to reducers. Therefore, it is recommended not to modify state inside reducers, but instead to return a new state object.
> 
> createSlice does not support the extraReducers property so there is currently no way for a slice to listen for a global action. Maybe I will add it

&nbsp;

## Example
### **Defining a slice**
```typescript
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
```

&nbsp;

### **Slice exposes each individual case reducer, so you can reuse them between slices.**
```typescript
const timerSlice = createSlice({
    name: 'timer',
    initialState: { value: 0 },
    reducers: {
        increment: counterSlice.caseReducers.increment,
        reset: () => ({ value: 0 }),
        setTime: (state, action: PayloadAction<number>) => ({ value: action.payload })
    }
})

export const { actions: timerActions, reducer: timerReducer } = timerSlice
export default timerSlice
```

&nbsp;

### **Usage with Rodux**
```typescript
import { counterActions, counterReducer } from "shared/counter";
import { timerActions, timerReducer } from "shared/timer";

const reducer = combineReducers({
    counter: counterReducer,
    timer: timerReducer,
})

const store = new Rodux.Store(reducer) // { counter: { value: 0 }, timer: { value: 0 } }

// Actions will not be shared across reducers
store.dispatch(timerActions.increment()) // { counter: { value: 0 }, timer: { value: 1 } }
store.dispatch(counterActions.incrementByAmount(10)) // { counter: { value: 10 }, timer: { value: 1 } }
```

## License

createSlice is licensed under the [MIT License](LICENSE.md).