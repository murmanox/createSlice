import Rodux from "@rbxts/rodux"

import { InferPayload, SliceCaseReducer } from "./types"

export interface PayloadAction<Payload, Name extends string = string> extends Rodux.Action<Name> {
	payload: Payload
}

export type PayloadActionCreator<
	CR extends SliceCaseReducer<any>,
	ActionName extends string,
> = unknown extends InferPayload<CR>
	? Rodux.ActionCreator<ActionName, [], {}>
	: Rodux.ActionCreator<ActionName, [payload: InferPayload<CR>], { payload: InferPayload<CR> }>
