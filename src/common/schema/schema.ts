import { type Type, type } from "arktype";

export * from "./collection.js";
export * from "./dates.js";
export * from "./pagination.js";

export const HandleSchema = type(
	/^[a-z0-9]+(?:-[a-z0-9]+)*$|^[a-z][a-zA-Z0-9]+$/,
);
export type Handle = typeof HandleSchema.inferOut;

export function normalizeUrlWithTokens(url: string | URL): string {
	return String(url)
		.replace(/%7B%7B/g, "{{")
		.replace(/%7D%7D/g, "}}");
}

export const optionallyNullishToUndefined = <t extends type.Any>(
	t: t,
): [type<t["t"]>, "?"] =>
	(t as Type)
		.or("null | undefined")
		.pipe((v) => (v == null ? undefined : v))
		.optional() as never;

export const optionallyNullish = <t extends type.Any>(
	t: t,
): [type<t["t"] | null | undefined>, "?"] =>
	(t as Type).or("null | undefined").optional() as never;

export const optionallyUndefined = <t extends type.Any>(
	t: t,
): [type<t["t"] | undefined>, "?"] =>
	(t as Type).or("undefined").optional() as never;
