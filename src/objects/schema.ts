import { z } from "zod";
import { AppReferenceSchema } from "../apps/schema.js";
import {
	type Handle,
	HandleSchema,
	normalizeUrlWithTokens,
	RequiredDatePayloadSchema,
	RequiredDateSchema,
} from "../common/index.js";

export {
	HandleSchema as AppObjectHandleSchema,
	type Handle as AppObjectHandle,
};

const UrlSchema = z.instanceof(URL);
const UrlStringSchema = z.string().url();

const AnyAppObjectUrlSchema = z.union([
	z.undefined(),
	UrlSchema,
	UrlStringSchema,
]);

export const AppObjectUrlSchema = AnyAppObjectUrlSchema.transform((v) =>
	v instanceof URL ? v : v ? new URL(v) : undefined,
);

export const AppObjectUrlStringSchema = AnyAppObjectUrlSchema.transform((v) =>
	v === undefined ? undefined : normalizeUrlWithTokens(v),
);

export const NullableAppObjectUrlStringSchema = AnyAppObjectUrlSchema.or(
	z.null(),
).transform((v) => (!v ? undefined : normalizeUrlWithTokens(v)));

export const AppObjectReferenceSchema = z.object({
	handle: HandleSchema,
	name: z.string(),
});
export type AppObjectReference = z.output<typeof AppObjectReferenceSchema>;

export const AppObjectSchema = AppObjectReferenceSchema.extend({
	app: AppReferenceSchema,
	url: AppObjectUrlSchema.optional(),
	createdAt: RequiredDateSchema,
	updatedAt: RequiredDateSchema,
});
export type AppObjectProperties = z.input<typeof AppObjectSchema>;
export type AppObject = z.output<typeof AppObjectSchema>;

export const AppObjectPayloadSchema = AppObjectReferenceSchema.extend({
	app: AppReferenceSchema,
	url: AppObjectUrlStringSchema.optional(),
	createdAt: RequiredDatePayloadSchema,
	updatedAt: RequiredDatePayloadSchema,
});
export type AppObjectPayload = z.output<typeof AppObjectPayloadSchema>;

export const InsertAppObjectPayloadSchema = AppObjectReferenceSchema.extend({
	url: AppObjectUrlStringSchema.optional(),
});
export type InsertAppObjectInput = z.input<typeof InsertAppObjectPayloadSchema>;
export type InsertAppObjectPayload = z.output<
	typeof InsertAppObjectPayloadSchema
>;

export const UpdateAppObjectPayloadSchema = z.object({
	name: z.string().optional(),
	url: NullableAppObjectUrlStringSchema.optional(),
});
export type UpdateAppObjectInput = z.input<typeof UpdateAppObjectPayloadSchema>;
export type UpdateAppObjectPayload = z.output<
	typeof UpdateAppObjectPayloadSchema
>;
