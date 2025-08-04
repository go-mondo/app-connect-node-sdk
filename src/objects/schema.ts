import { type } from "arktype";
import { AppReferenceSchema } from "src/apps/schema.js";
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

const UrlScheama = type.instanceOf(URL);
const UrlStringScheama = type("string.url");

const AnyAppObjectUrlSchema = type("undefined")
	.or(UrlScheama)
	.or(UrlStringScheama);

export const AppObjectUrlSchema = AnyAppObjectUrlSchema.pipe((v) =>
	v instanceof URL ? v : v ? new URL(v) : undefined,
);

export const AppObjectUrlStringSchema = AnyAppObjectUrlSchema.pipe((v) =>
	v === undefined ? undefined : normalizeUrlWithTokens(v),
);

export const NullableAppObjectUrlStringSchema = AnyAppObjectUrlSchema.or(
	"null",
).pipe((v) => (!v ? undefined : normalizeUrlWithTokens(v)));

export const AppObjectReferenceSchema = type({
	handle: HandleSchema,
	name: type("string"),
});
export type AppObjectReference = typeof AppObjectReferenceSchema.inferOut;

export const AppObjectSchema = AppObjectReferenceSchema.and({
	app: AppReferenceSchema,
	url: AppObjectUrlSchema.optional(),
	createdAt: RequiredDateSchema,
	updatedAt: RequiredDateSchema,
});
export type AppObjectProperties = typeof AppObjectSchema.inferIn;
export type AppObject = typeof AppObjectSchema.inferOut;

export const AppObjectPayloadSchema = AppObjectReferenceSchema.and({
	app: AppReferenceSchema,
	url: AppObjectUrlStringSchema.optional(),
	createdAt: RequiredDatePayloadSchema,
	updatedAt: RequiredDatePayloadSchema,
});
export type AppObjectPayload = typeof AppObjectPayloadSchema.inferOut;

export const InsertAppObjectPayloadSchema = AppObjectReferenceSchema.and({
	url: AppObjectUrlStringSchema.optional(),
});
export type InsertAppObjectInput = typeof InsertAppObjectPayloadSchema.inferIn;
export type InsertAppObjectPayload =
	typeof InsertAppObjectPayloadSchema.inferOut;

export const UpdateAppObjectPayloadSchema = type({
	name: type("string").optional(),
	url: NullableAppObjectUrlStringSchema.optional(),
});
export type UpdateAppObjectInput = typeof UpdateAppObjectPayloadSchema.inferIn;
export type UpdateAppObjectPayload =
	typeof UpdateAppObjectPayloadSchema.inferOut;
