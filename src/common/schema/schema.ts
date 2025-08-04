import { z } from "zod";

export * from "./collection.js";
export * from "./dates.js";
export * from "./pagination.js";

export const HandleSchema = z
	.string()
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^[a-z][a-zA-Z0-9]+$/);
export type Handle = z.infer<typeof HandleSchema>;

export function normalizeUrlWithTokens(url: string | URL): string {
	return String(url)
		.replace(/%7B%7B/g, "{{")
		.replace(/%7D%7D/g, "}}");
}

export const optionallyNullishToUndefined = <T extends z.ZodTypeAny>(
	schema: T,
) =>
	schema
		.nullable()
		.optional()
		.transform((v) => (v == null ? undefined : v));

export const optionallyNullish = <T extends z.ZodTypeAny>(schema: T) =>
	schema.nullable().optional();

export const optionallyUndefined = <T extends z.ZodTypeAny>(schema: T) =>
	schema.optional();
