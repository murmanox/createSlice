import { ActionCreator, createReducer, makeActionCreator } from "@rbxts/rodux"

import type { CreateSliceOptions, Slice, SliceCaseReducer, SliceCaseReducers } from "./types"
import { entries } from "./utils/object"

type AnyActionCreator = ActionCreator<string, any[], any>

/**
 * Shared ActionCreator generator function rather than creating a new one for each action.
 * Autistic optimisation.
 */
const payloadGenerator = (payload: any) => ({ payload })

/**
 *
 * @param options
 * @returns
 */
export function createSlice<
	State,
	Name extends string,
	CaseReducers extends SliceCaseReducers<State>,
>(options: CreateSliceOptions<State, Name, CaseReducers>): Slice<State, Name, CaseReducers> {
	const actionCreators: Record<string, AnyActionCreator> = {}
	const sliceCaseReducersByName: Record<string, SliceCaseReducer<State>> = {}

	for (const [name, caseReducer] of entries(options.reducers)) {
		const actionName = `${options.name}/${name as string}`
		actionCreators[name as string] = makeActionCreator(actionName, payloadGenerator)
		sliceCaseReducersByName[actionName] = caseReducer
	}

	// TODO: Make this immutable
	const initialState = typeIs(options.initialState, "function")
		? options.initialState()
		: options.initialState
	const sliceReducer = createReducer(initialState, sliceCaseReducersByName as any)

	return {
		name: options.name,
		actions: actionCreators as any,
		reducer: sliceReducer as any,
		caseReducers: options.reducers,
	}
}
