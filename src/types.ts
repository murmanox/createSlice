import Rodux, { Reducer } from "@rbxts/rodux"

import type { PayloadAction, PayloadActionCreator } from "./createAction"

/**
 * Options for `createSlice`
 */
export interface CreateSliceOptions<
	State,
	Name extends string = string,
	Reducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
> {
	/**
	 * The slice's name. Used to namespace the generated action types.
	 */
	name: Name
	/**
	 * The initial state that should be used when the reducer is called the first time. This may also be a "lazy initializer" function, which should return an initial state value when called. This will be used whenever the reducer is called with `undefined` as its state value, and is primarily useful for cases like reading initial state from `localStorage`.
	 */
	initialState: State | (() => State)
	/**
	 * A mapping from action types to action-type-specific *case reducer*
	 * functions. For every action type, a matching action creator will be
	 * generated using `makeActionCreator()`.
	 */
	reducers: Reducers
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
	reducer: Reducer<State, CaseReducerActions<CaseReducers, Name>>
	/**
	 * The individual case reducer functions that were passed in the `reducers` parameter.
	 * This enables reuse and testing if they were defined inline when calling `createSlice`.
	 */
	caseReducers: CaseReducers
	/**
	 * Action creators for the types of actions that are handled by the slice reducer.
	 */
	actions: CaseReducerActionCreators<CaseReducers, Name>
}

/**
 * Case Reducers
 */
export type SliceCaseReducer<State, Payload = any> = (
	this: void,
	state: State,
	action: PayloadAction<Payload>,
) => State | void
export type SliceCaseReducers<State> = Record<string, SliceCaseReducer<State, any>>

/**
 * Combines the name of a slice with the name of an action with a "/" between them.
 */
type SliceActionName<SliceName extends string, ActionName extends keyof any> = ActionName extends
	| string
	| number
	? `${SliceName}/${ActionName}`
	: string

/**
 * Creates an interface with a PayloadActionCreator for each caseReducer
 */
export type CaseReducerActionCreators<
	CaseReducers extends SliceCaseReducers<any>,
	SliceName extends string,
> = {
	[ActionName in keyof CaseReducers]: PayloadActionCreator<
		CaseReducers[ActionName],
		SliceActionName<SliceName, ActionName>
	>
}

/**
 * Creates a union of all PayloadActions for a group of caseReducers
 */
export type CaseReducerActions<
	CaseReducers extends SliceCaseReducers<any>,
	SliceName extends string,
> = {
	[ActionName in keyof CaseReducers]: unknown extends InferPayload<CaseReducers[ActionName]>
		? Rodux.Action<SliceActionName<SliceName, ActionName>>
		: PayloadAction<
				InferPayload<CaseReducers[ActionName]>,
				SliceActionName<SliceName, ActionName>
		  >
}[keyof CaseReducers]

/**
 * Infers the State from a CaseReducer
 */
export type InferState<T extends SliceCaseReducer<any, any>> = T extends SliceCaseReducer<
	infer State,
	any
>
	? State
	: never

/**
 * Infers the payload from a CaseReducer
 */
export type InferPayload<T> = T extends SliceCaseReducer<any, infer U> ? U : never
