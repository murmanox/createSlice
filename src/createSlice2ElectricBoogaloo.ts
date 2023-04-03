/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionCreator, AnyAction, makeActionCreator } from "@rbxts/rodux"

import { PayloadAction } from "./createAction"

type ReducerWithoutPayload<State> = (this: void, state: State, action: AnyAction) => State | void
type ReducerWithPayload<State, Payload> = (
	this: void,
	state: State,
	action: PayloadAction<Payload>,
) => State | void

type InferReducerPayload<T> = T extends ReducerWithPayload<any, infer P> ? P : never

type ReducersToActions<
	SliceName extends string,
	ACR extends Record<string, ReducerWithPayload<any, never>>,
> = {
	[K in keyof ACR]: ACR[K] extends ReducerWithPayload<any, void> // Can't infer here as excluding the payload will return unknown instead of void
		? [InferReducerPayload<ACR[K]>] extends [void]
			? ActionCreator<string, [], {}> // Payload was speci
			: ReducerWithPayload<any, void> extends ACR[K] // Payload is void or unknown
			? ActionCreator<string, [payload: unknown], { payload: unknown }> // Payload is unknown
			: ActionCreator<string, [], {}> // Payload is void
		: ACR[K] extends ReducerWithPayload<any, infer Payload> // Payload is known
		? [Payload] extends [never] // Payload is never
			? ActionCreator<string, [], {}>
			: ActionCreator<string, [payload: Payload], { payload: Payload }>
		: never
}

type ValidateCaseReducers<S, ACR extends Record<string, ReducerWithPayload<any, never>>> = {
	[K in keyof ACR]: ACR[K] extends ReducerWithPayload<any, void> // Can't infer here as excluding the payload will return unknown instead of void
		? [InferReducerPayload<ACR[K]>] extends [void]
			? ReducerWithoutPayload<S> // Payload was specified as void (why??)
			: ReducerWithPayload<any, void> extends ACR[K] // Payload is void or unknown
			? ReducerWithPayload<S, unknown> // Payload is unknown
			: ReducerWithoutPayload<S> // Payload is void
		: ACR[K] extends ReducerWithPayload<any, infer Payload> // Payload is known
		? [Payload] extends [never] // Payload is never
			? ReducerWithoutPayload<S>
			: ReducerWithPayload<S, Payload>
		: never
}

type SliceActionName<SliceName extends string, ActionName extends keyof any> = ActionName extends
	| string
	| number
	? `${SliceName}/${ActionName}`
	: string

type CaseReducerActionCreators<
	SliceName extends string,
	ACR extends Record<string, ReducerWithPayload<any, never>>,
> = {
	[ActionName in keyof ACR]: CaseReducerToActionCreator<
		SliceActionName<SliceName, ActionName>,
		ACR[ActionName]
	>
}

type CaseReducerToActionCreator<
	ActionName extends string,
	CR extends ReducerWithPayload<any, never>,
> = CR extends ReducerWithPayload<any, void> // Can't infer here as excluding the payload will return unknown instead of void
	? [InferReducerPayload<CR>] extends [void]
		? ActionCreator<ActionName, [], {}> // Payload was speci
		: ReducerWithPayload<any, void> extends CR // Payload is void or unknown
		? ActionCreator<ActionName, [payload: unknown], { payload: unknown }> // Payload is unknown
		: ActionCreator<ActionName, [], {}> // Payload is void
	: CR extends ReducerWithPayload<any, infer Payload> // Payload is known
	? [Payload] extends [never] // Payload is never
		? ActionCreator<ActionName, [], {}>
		: ActionCreator<ActionName, [payload: Payload], { payload: Payload }>
	: never

export function createSlice<
	State,
	Name extends string = string,
	Reducers extends Record<string, ReducerWithPayload<any, never>> = Record<
		string,
		ReducerWithPayload<State, never>
	>,
>(options: {
	name: Name
	initialState: State
	reducers: Reducers
}): {
	actions: CaseReducerActionCreators<Name, Reducers>
	caseReducers: ValidateCaseReducers<State, Reducers>
} {
	return undefined!
}

const noPayloadAction = makeActionCreator("counter/increment", () => {
	return {}
})

const payloadAction = makeActionCreator("counter/incrementByAmount", (payload: number) => {
	return { payload }
})
