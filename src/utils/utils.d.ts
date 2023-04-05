export type IsAny<T> = 0 extends T & 1 ? 1 : 0
export type If<B extends number, Then, Else = never> = B extends 1 ? Then : Else
export type Extends<A1, A2> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0
export type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <A>() => A extends A1 ? 1 : 0
	? 1
	: 0
