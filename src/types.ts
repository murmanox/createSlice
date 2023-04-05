import Rodux from "@rbxts/rodux"

import { Equals, Extends, If, IsAny } from "./utils/utils"

/**
 * Infer the return type of a CaseReducer
 */
export type InferReturnType<T> = T extends CaseReducer<any, any, infer R> ? R : never

/**
 * Rodux action with a generic payload property. If the payload's type is void, Rodux.AnyAction will be used instead.
 */
export type PayloadAction<T> = If<Equals<T, void>, Rodux.AnyAction, Rodux.Action & { payload: T }>

/**
 * Options for `createSlice`
 */
export interface CreateSliceOptions<
	State,
	Name extends string,
	CaseReducers extends SliceCaseReducers<State>,
> {
	/**
	 * The slice's name. Used to namespace the generated action types.
	 */
	name: Name
	/**
	 * The initial state that should be used when the reducer is called the first time.
	 * This may also be a "lazy initializer" function, which should return an initial state value when called.
	 * This will be used whenever the reducer is called with `undefined` as its state value.
	 */
	initialState: State | (() => State)
	/**
	 * A mapping from action types to action-type-specific *case reducer* functions.
	 * For every action type, a matching action creator will be generated using `makeActionCreator()`.
	 */
	reducers: CaseReducers
}

/**
 * The return value of `createSlice
 */
export interface Slice<
	State,
	Name extends string = string,
	CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
> {
	/**
	 * The slice's name.
	 */
	name: Name
	/**
	 * The slice's reducer.
	 */
	reducer: SliceReducer<State, Name, CaseReducers>
	/**
	 * The individual case reducer functions that were passed in the `reducers` parameter.
	 * This enables reuse and testing if they were defined inline when calling `createSlice`.
	 */
	caseReducers: ValidateCaseReducers<State, CaseReducers>
	/**
	 * Action creators for the types of actions that are handled by the slice reducer.
	 */
	actions: CaseReducerActionCreators<Name, CaseReducers>
}

/**
 * Case Reducers
 */
export type CaseReducer<State, Payload = any, Return extends State | void = State | void> = (
	this: void,
	state: State,
	payload: PayloadAction<Payload>,
) => Return
export type SliceCaseReducers<S, P = any> = Record<string, CaseReducer<S, P>>

/**
 * Assign each case reducer to the CaseReducer type. Without this, defining a reducer
 * as `(state) => {}` would infer action to PayloadAction<unknown> instead of PayloadAction<void>
 */
type ValidateCaseReducers<S, ACR extends SliceCaseReducers<S>> = {
	[K in keyof ACR]: If<
		Extends<Parameters<ACR[K]>["length"], 0 | 1>,
		CaseReducer<S, void, InferReturnType<ACR[K]>>, // 0-1 params means no action param
		ACR[K] extends CaseReducer<S, infer P, infer R>
			? If<IsAny<P>, CaseReducer<S, any, R>, CaseReducer<S, P, R>>
			: never
	>
}

/**
 * Creates a Rodux ActionCreator for a given CaseReducer
 */
type MakeCaseAction<N extends string, CR extends CaseReducer<any, any>> = If<
	Extends<Parameters<CR>["length"], 0 | 1>,
	Rodux.ActionCreator<N, [], {}>,
	CR extends CaseReducer<any, infer P>
		? If<
				IsAny<P>,
				Rodux.ActionCreator<N, [payload?: any], { payload: any }>,
				Rodux.ActionCreator<N, [payload: P], { payload: P }>
		  >
		: never
>

/**
 * Combines the name of a slice with the name of an action with a "/" between them.
 */
type SliceActionName<SliceName extends string, ActionName extends keyof any> = ActionName extends
	| string
	| number
	? `${SliceName}/${ActionName}`
	: string

/**
 * Creates a union of all Rodux Actions for a group of caseReducers
 */
type SliceReducerActions<N extends string, ACR extends SliceCaseReducers<any>> = {
	[K in keyof ACR]: ReturnType<MakeCaseAction<SliceActionName<N, K>, ACR[K]>>
}[keyof ACR]

/**
 * The slice's reducer
 */
type SliceReducer<S, N extends string, ACR extends SliceCaseReducers<S>> = Rodux.Reducer<
	S,
	SliceReducerActions<N, ACR>
>

/**
 * Creates an interface with a Rodux ActionCreator for each caseReducer
 */
type CaseReducerActionCreators<N extends string, ACR extends SliceCaseReducers<any>> = {
	[K in keyof ACR]: MakeCaseAction<SliceActionName<N, K>, ACR[K]>
}
